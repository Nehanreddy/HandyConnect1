import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  WrenchScrewdriverIcon,
  BoltIcon,
  WrenchIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  StarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import hero3 from '../assets/hero3.avif';
import ServiceBookingModal from '../components/ServiceBookingModal';

import electricianImg from '../assets/electrician.jpg';
import plumberImg from '../assets/plumber.jpg';
import carpenterImg from '../assets/carpenter.jpg';
import painterImg from '../assets/paint.jpg';
import applianceRepairImg from '../assets/appliancerepair.jpg';
import cleaning from '../assets/cleaning.jpeg';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Modal display
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Typing animation state for "Handy Connect"
  const titles = ['Handy Connect'];
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex] = useState(0);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 800, once: false });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scrollTo state navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Typing effect logic for "Handy Connect"
  useEffect(() => {
    const currentTitle = titles[currentIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentTitle) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
      } else {
        setTypedText(prev =>
          isDeleting
            ? prev.slice(0, -1)
            : currentTitle.slice(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentIndex, titles]);

  // Authentication check example
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const services = [
    {
      label: 'Plumber',
      description: 'Fix leaks and pipe issues',
      icon: <WrenchIcon className="h-8 w-8 text-purple-400" />,
      img: plumberImg,
    },
    {
      label: 'Electrician',
      description: 'Safe and efficient fixes',
      icon: <BoltIcon className="h-8 w-8 text-yellow-400" />,
      img: electricianImg,
    },
    {
      label: 'Carpenter',
      description: 'Furniture & fittings',
      icon: <WrenchScrewdriverIcon className="h-8 w-8 text-orange-400" />,
      img: carpenterImg,
    },
    {
      label: 'Painter',
      description: 'Interior & exterior painting',
      icon: <PaintBrushIcon className="h-8 w-8 text-green-400" />,
      img: painterImg,
    },
    {
      label: 'Appliance Repair',
      description: 'Microwaves, fridges, more',
      icon: <Cog6ToothIcon className="h-8 w-8 text-purple-400" />,
      img: applianceRepairImg,
    },
    {
      label: 'Housekeeping',
      description: 'House Cleaning, Sanitization, more',
      icon: <SparklesIcon className="h-8 w-8 text-purple-400" />,
      img: cleaning,
    },
  ];

  const reviews = [
    {
      name: 'Ravi Kumar',
      comment: 'Quick and reliable! Got my plumbing fixed within an hour.',
      rating: 5,
    },
    {
      name: 'Anjali Mehra',
      comment: 'Excellent service, very professional and polite electrician.',
      rating: 4,
    },
    {
      name: 'Neha Sharma',
      comment: 'Affordable and hassle-free. Definitely recommend!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-gray-200">
      {/* Hero Section with Full Background Image - Now covers full viewport */}
      <section 
        className="relative flex flex-col items-center justify-center px-4 py-12 lg:py-20 min-h-screen w-full"
        style={{
          backgroundImage: `url(${hero3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content - centered text with extra top margin to account for floating navbar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center space-y-6 mt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-300 via-white to-purple-400 bg-clip-text text-transparent font-extrabold">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-lg">
            Your Home. Our Experts. Hassle-Free Services, Anytime.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-100 drop-shadow-lg">
            A one-stop platform to book trusted plumbing, painting, electrical, carpentry, and appliance repair professionals instantly.
          </p>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2"
            aria-label="Explore our services"
          >
            Explore Services <span className="text-xl">→</span>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-center text-purple-400 mb-12 tracking-wide"
          data-aos="fade-up"
        >
          Choose Your Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {services.map(({ label, description, icon, img }, idx) => (
            <div
              key={label}
              data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-transform cursor-pointer flex flex-col"
              onClick={() => {
                if (isLoggedIn) {
                  setSelectedService(label);
                  setShowModal(true);
                } else {
                  navigate('/login');
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isLoggedIn) {
                    setSelectedService(label);
                    setShowModal(true);
                  } else {
                    navigate('/login');
                  }
                }
              }}
              aria-label={`Select ${label} service`}
            >
              {img && (
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={img}
                    alt={`${label} illustration`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 text-center flex flex-col items-center flex-grow">
                <div className="mb-4">{icon}</div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">{label}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="bg-gray-900 py-16 px-6 max-w-7xl mx-auto rounded-2xl shadow-lg">
        <h2
          className="text-4xl font-bold text-center text-purple-400 mb-10 tracking-wide"
          data-aos="fade-up"
        >
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <article
              key={index}
              className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg select-none">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{review.name}</p>
                  <div className="flex" aria-label={`Rating: ${review.rating} stars`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic text-sm">"{review.comment}"</p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-6 mt-16 max-w-7xl mx-auto rounded-t-xl shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-bold text-xl text-purple-400 mb-2">Handy Connect</h4>
            <p>Bringing trusted home services right to your doorstep.</p>
          </div>
          <nav aria-label="Quick links">
            <h4 className="font-bold text-xl text-purple-400 mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:underline text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded">
                  Services
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:underline text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded">
                  Reviews
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <address>
            <h4 className="font-bold text-xl text-purple-400 mb-2">Contact</h4>
            <p>
              Email:{' '}
              <a href="mailto:support@handyconnect.com" className="text-gray-300 hover:underline">
                support@handyconnect.com
              </a>
            </p>
            <p>
              Phone:{' '}
              <a href="tel:+919876543210" className="text-gray-300 hover:underline">
                +919876543210
              </a>
            </p>
          </address>
        </div>
        <p className="text-center text-sm mt-10 text-gray-600 select-none">
          &copy; {new Date().getFullYear()} Handy Connect. All rights reserved.
        </p>
      </footer>

      {/* Booking Modal */}
      {showModal && selectedService && (
        <ServiceBookingModal serviceType={selectedService} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default HomePage;
