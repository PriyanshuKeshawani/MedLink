export const printPrescription = (record) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const medicineRows = record.prescriptions?.map(p => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 14px 10px; font-weight: 700; color: #0f172a; font-size: 13px;">${p.medicineName}</td>
      <td style="padding: 14px 10px; color: #334155; font-size: 13px;">${p.dosage}</td>
      <td style="padding: 14px 10px; color: #334155; font-size: 13px;">${p.frequency}</td>
      <td style="padding: 14px 10px; color: #334155; font-size: 13px;">${p.duration}</td>
      <td style="padding: 14px 10px; color: #64748b; font-style: italic; font-size: 13px;">${p.instructions || 'Take as directed'}</td>
    </tr>
  `).join('') || `
    <tr>
      <td colspan="5" style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">No medications prescribed.</td>
    </tr>
  `;

  const vitalsContent = record.clinicalNotes?.vitals ? `
    <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 30px;">
      <h3 style="margin-top: 0; margin-bottom: 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 800;">Patient Vital Signs</h3>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
        <div style="border-right: 1px solid #f1f5f9; padding-right: 10px;">
          <span style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Blood Pressure</span>
          <span style="font-size: 15px; font-weight: 800; color: #0f172a;">${record.clinicalNotes.vitals.bloodPressure || '120/80'}</span>
        </div>
        <div style="border-right: 1px solid #f1f5f9; padding-right: 10px;">
          <span style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Heart Rate</span>
          <span style="font-size: 15px; font-weight: 800; color: #ef4444;">${record.clinicalNotes.vitals.heartRate ? record.clinicalNotes.vitals.heartRate + ' bpm' : '72 bpm'}</span>
        </div>
        <div style="border-right: 1px solid #f1f5f9; padding-right: 10px;">
          <span style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Temperature</span>
          <span style="font-size: 15px; font-weight: 800; color: #3b82f6;">${record.clinicalNotes.vitals.temperature ? record.clinicalNotes.vitals.temperature + ' °F' : '98.6 °F'}</span>
        </div>
        <div>
          <span style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Weight</span>
          <span style="font-size: 15px; font-weight: 800; color: #10b981;">${record.clinicalNotes.vitals.weight ? record.clinicalNotes.vitals.weight + ' kg' : '70 kg'}</span>
        </div>
      </div>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Prescription - MedLink Health OS</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;850&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 40px;
            color: #0f172a;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .logo-area h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 850;
            color: #0f172a;
            letter-spacing: -0.03em;
          }
          .logo-area h1 span {
            color: #6366f1;
          }
          .logo-area p {
            margin: 4px 0 0 0;
            font-size: 10px;
            color: #64748b;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.15em;
          }
          .clinic-details {
            text-align: right;
            font-size: 12px;
            color: #64748b;
            line-height: 1.6;
            font-weight: 500;
          }
          .meta-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          }
          .meta-card h2 {
            margin: 0 0 10px 0;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 6px;
          }
          .meta-card p {
            margin: 4px 0;
            font-size: 13px;
            color: #334155;
            line-height: 1.4;
          }
          .prescription-title {
            font-size: 22px;
            font-weight: 850;
            color: #0f172a;
            margin-top: 40px;
            margin-bottom: 24px;
            border-left: 4px solid #6366f1;
            padding-left: 14px;
            letter-spacing: -0.02em;
          }
          .clinical-notes {
            margin-bottom: 24px;
          }
          .clinical-notes h3 {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            margin-bottom: 8px;
          }
          .clinical-notes p {
            font-size: 14px;
            color: #334155;
            line-height: 1.6;
            margin: 0;
            font-weight: 500;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            margin-bottom: 40px;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 800;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-align: left;
            padding: 14px 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          .footer {
            margin-top: 80px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .footer-logo {
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
          }
          .signature-area {
            text-align: right;
          }
          .signature-line {
            width: 220px;
            border-bottom: 1px solid #475569;
            margin-bottom: 10px;
            margin-left: auto;
          }
          .signature-text {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
          }
          .signature-sub {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-area">
            <h1>Med<span>Link.</span></h1>
            <p>Clinical Intelligence Gateway</p>
          </div>
          <div class="clinic-details">
            <strong>MedLink Virtual Care Center</strong><br />
            100 Health Science Parkway<br />
            Suite 500, Metro Health District<br />
            support@medlink.com | +1 (800) 555-0199
          </div>
        </div>

        <div class="meta-info">
          <div class="meta-card">
            <h2>Doctor Details</h2>
            <p><strong>Dr. ${record.doctor?.firstName || 'Clinical'} ${record.doctor?.lastName || 'Specialist'}</strong></p>
            <p style="font-weight: 600; color: #6366f1;">${record.doctor?.profile?.specialization || record.doctor?.specialization || 'General Care Specialist'}</p>
            <p style="color: #64748b; font-size: 11px;">NPI/License: MD-99281-LIC</p>
          </div>
          <div class="meta-card" style="text-align: right;">
            <h2>Patient Details</h2>
            <p><strong>${record.patient?.firstName || 'Valued'} ${record.patient?.lastName || 'Patient'}</strong></p>
            <p>Email: ${record.patient?.email || 'N/A'}</p>
            <p>Date: ${new Date(record.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        <div class="prescription-title">Official Medical Prescription</div>

        ${vitalsContent}

        <div class="clinical-notes">
          <h3>Diagnosis Summary</h3>
          <p style="font-size: 16px; font-weight: 700; color: #0f172a;">${record.clinicalNotes?.diagnosis || 'Routine Health Check'}</p>
        </div>

        ${record.clinicalNotes?.chiefComplaint ? `
          <div class="clinical-notes" style="margin-top: 16px;">
            <h3>Chief Complaint</h3>
            <p>${record.clinicalNotes.chiefComplaint}</p>
          </div>
        ` : ''}

        ${record.clinicalNotes?.notes ? `
          <div class="clinical-notes" style="margin-top: 16px;">
            <h3>Physician Directives & Advice</h3>
            <p style="background-color: #fafafa; border-radius: 12px; padding: 14px; border: 1px solid #f1f5f9;">${record.clinicalNotes.notes}</p>
          </div>
        ` : ''}

        <div class="prescription-title" style="margin-top: 40px; font-size: 18px;">Prescribed RX Plan</div>
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Medicine Name</th>
              <th style="width: 15%;">Dosage</th>
              <th style="width: 20%;">Frequency</th>
              <th style="width: 15%;">Duration</th>
              <th style="width: 25%;">Special Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${medicineRows}
          </tbody>
        </table>

        <div class="footer">
          <div class="footer-logo">
            MedLink Health OS Secure Receipt ID: ${record._id}<br />
            Valid only with official electronic authorization stamps.
          </div>
          <div class="signature-area">
            <div class="signature-line"></div>
            <div class="signature-text">Dr. ${record.doctor?.firstName || 'Clinical'} ${record.doctor?.lastName || 'Specialist'}</div>
            <div class="signature-sub">Authorized Electronic Signature</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
