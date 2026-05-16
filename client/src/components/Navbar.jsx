import React from 'react';
import { Activity, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-4 glass shadow-lg' : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2 bg-primary-600 rounded-lg group-hover:rotate-12 transition-transform">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">MedLink</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#" className="hover:text-primary-600 transition-colors">Find Doctors</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Services</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Reviews</a>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
          <button className="btn-primary">Join Now</button>
        </div>

        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
