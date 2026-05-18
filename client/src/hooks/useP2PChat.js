import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19002' },
    { urls: 'stun:stun1.l.google.com:19002' }
  ]
};

export const useP2PChat = (activeContactId) => {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [peerOnline, setPeerOnline] = useState(false);
  const [p2pConnected, setP2pConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);

  // 1. Fetch DB Chat History & Set up Socket Signaling Tunnel
  useEffect(() => {
    if (!user || !token) return;

    // Connect to websocket signaling server
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      console.log('[P2P Socket] Connected to Signaling Gateway');
      socketRef.current.emit('join', user.id);

      // Check if our active contact is online
      if (activeContactId) {
        socketRef.current.emit('check-peer-online', { peerId: activeContactId });
      }
    });

    // Listen for peer online/offline status notifications
    socketRef.current.on('peer-status', ({ userId, online }) => {
      if (userId === activeContactId) {
        console.log(`[P2P Socket] Contact ${userId} status:`, online ? 'Online' : 'Offline');
        setPeerOnline(online);
        if (online) {
          // Contact is online! Initiate WebRTC peer handshake offer
          initiateP2PConnection();
        } else {
          closeP2PConnection();
        }
      }
    });

    // Listen for server fallback real-time notifications (if P2P is offline or connecting)
    socketRef.current.on('receive_message', (message) => {
      if (message.sender._id === activeContactId || message.sender === activeContactId) {
        console.log('[P2P Server Fallback] Received offline/delayed message:', message);
        setMessages(prev => {
          // Prevent duplicates if already got it via direct WebRTC DataChannel
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    // Listen for WebRTC direct signals (SDP Offer, SDP Answer, ICE Candidates)
    socketRef.current.on('p2p-signal', async ({ senderId, signalData }) => {
      if (senderId !== activeContactId) return;

      try {
        if (!peerConnectionRef.current) {
          createPeerConnection();
        }

        const pc = peerConnectionRef.current;

        if (signalData.sdp) {
          console.log('[P2P WebRTC] Received remote SDP description:', signalData.sdp.type);
          await pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp));

          if (signalData.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current.emit('p2p-signal', {
              recipientId: activeContactId,
              signalData: { sdp: pc.localDescription }
            });
          }
        } else if (signalData.candidate) {
          console.log('[P2P WebRTC] Received remote ICE Candidate');
          await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
        }
      } catch (err) {
        console.error('[P2P WebRTC] Error processing incoming signal:', err);
      }
    });

    return () => {
      closeP2PConnection();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, token, activeContactId]);

  // Load chat history from database when selected contact changes (WhatsApp delayed recovery!)
  useEffect(() => {
    if (!activeContactId || !token) {
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/messages/history/${activeContactId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
        toast.error('Could not sync chat history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Check online status again on select
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('check-peer-online', { peerId: activeContactId });
    }
  }, [activeContactId, token]);

  // 2. WebRTC Peer Connection Core Logic
  const createPeerConnection = () => {
    console.log('[P2P WebRTC] Creating new peer connection...');
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Send local ICE candidates to remote peer via Signaling channel
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('p2p-signal', {
          recipientId: activeContactId,
          signalData: { candidate: event.candidate }
        });
      }
    };

    // When connection status changes
    pc.onconnectionstatechange = () => {
      console.log('[P2P WebRTC] Connection state modified:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setP2pConnected(true);
        toast.success('P2P Direct Tunnel established! 🔒', { id: 'p2p-toast' });
      } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        setP2pConnected(false);
      }
    };

    // Handle incoming direct data channel (registered by Answerer side)
    pc.ondatachannel = (event) => {
      console.log('[P2P WebRTC] Received remote RTCDataChannel');
      const channel = event.channel;
      setupDataChannel(channel);
    };

    return pc;
  };

  const setupDataChannel = (channel) => {
    dataChannelRef.current = channel;

    channel.onopen = () => {
      console.log('[P2P WebRTC DataChannel] P2P channel status is OPEN!');
      setP2pConnected(true);
    };

    channel.onclose = () => {
      console.log('[P2P WebRTC DataChannel] P2P channel closed');
      setP2pConnected(false);
    };

    // Receive message directly from remote peer (no server involvement!)
    channel.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      console.log('[P2P Direct Payload] Received message directly over WebRTC:', payload);
      
      if (payload.type === 'typing') {
        setTyping(payload.isTyping);
      } else if (payload.type === 'message') {
        setMessages(prev => {
          if (prev.some(m => m._id === payload.data._id)) return prev;
          return [...prev, payload.data];
        });
      }
    };
  };

  // Caller (Initiator) Side
  const initiateP2PConnection = async () => {
    try {
      const pc = createPeerConnection();
      
      // Establish our local data channel
      const channel = pc.createDataChannel('chat_channel', { ordered: true });
      setupDataChannel(channel);

      // Create and send WebRTC SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('[P2P WebRTC] Dispatching SDP offer to signaling gateway...');
      socketRef.current.emit('p2p-signal', {
        recipientId: activeContactId,
        signalData: { sdp: pc.localDescription }
      });
    } catch (err) {
      console.error('[P2P WebRTC] Failed to initiate connection:', err);
    }
  };

  const closeP2PConnection = () => {
    setP2pConnected(false);
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  // 3. Hybrid Message Delivery (WhatsApp style)
  const sendP2PMessage = async (text) => {
    if (!text.trim() || !activeContactId) return;

    try {
      // Step A: Send POST to Express/MongoDB Backend (Offline storage & Chat history backup)
      const dbRes = await axios.post('/api/messages', {
        recipientId: activeContactId,
        text,
        deliveryMode: p2pConnected ? 'p2p' : 'db_delayed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const messageObj = dbRes.data;
      
      // Add local message instantly to sender timeline
      setMessages(prev => [...prev, messageObj]);

      // Step B: If WebRTC P2P DataChannel is active, stream directly peer-to-peer!
      if (p2pConnected && dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
        console.log('[P2P WebRTC] Streaming message payload directly over DataChannel');
        dataChannelRef.current.send(JSON.stringify({
          type: 'message',
          data: messageObj
        }));
      }

      return messageObj;
    } catch (err) {
      console.error('Failed to dispatch message:', err);
      toast.error('Failed to send message');
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (p2pConnected && dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({
        type: 'typing',
        isTyping
      }));
    }
  };

  return {
    messages,
    loading,
    peerOnline,
    p2pConnected,
    typing,
    sendP2PMessage,
    sendTypingStatus
  };
};
