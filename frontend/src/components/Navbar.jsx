import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  Wrench,
  Menu,
  X 
} from 'lucide-react';
import logo from '../assets/image.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleAvailService = () => {
    if (window.location.pathname === '/') {
      scrollToSection('services');
    } else {
      navigate('/', { state: { scrollTo: 'services' } });
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navigationItems = [
    { label: 'About Us', action: () => navigate('/about') },
    { label: 'Avail a Service', action: handleAvailService },
    ...(user ? [{ label: 'My Services', action: () => navigate('/my-services') }] : []),
    { label: 'Contact Us', action: () => navigate('/contact') },
  ];

  return (
    // Updated: Added padding and made it truly floating
    <div className="fixed top-0 left-0 w-full z-50 p-4">
      <nav className="bg-black/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 max-w-7xl mx-auto hover:shadow-purple-500/20 transition-all duration-300">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button 
              onClick={handleLogoClick} 
              className="focus:outline-none cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <img src={logo} alt="HandyConnect Logo" className="h-12 w-auto" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex space-x-8 items-center">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-white hover:text-purple-200 font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                  <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-purple-400 group-hover:w-[calc(100%-24px)] transition-all duration-300 rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Right Section: User Auth & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* User Section */}
              {!user ? (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 border border-purple-400/20"
                >
                  Get Started
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 text-white hover:text-purple-200 transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15 px-4 py-2 rounded-xl border border-white/20 hover:border-purple-300/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium hidden sm:block">
                        Hi, {user.name?.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm border-b border-purple-200/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/profile');
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50/70 hover:text-purple-600 transition-all duration-200 rounded-lg mx-2"
                        >
                          <User size={18} className="text-gray-500" />
                          <span className="font-medium">My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/my-services');
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50/70 hover:text-purple-600 transition-all duration-200 rounded-lg mx-2"
                        >
                          <Wrench size={18} className="text-gray-500" />
                          <span className="font-medium">My Services</span>
                        </button>

                        <hr className="my-2 border-gray-200/30 mx-2" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50/70 hover:text-red-700 transition-all duration-200 rounded-lg mx-2"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu - Updated with floating style */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex flex-col space-y-2 px-2">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-purple-200 font-semibold transition-all duration-300 text-left px-4 py-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
