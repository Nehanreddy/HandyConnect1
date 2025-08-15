import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-gray-200 pt-20">
      <div className="pt-8 px-6 max-w-4xl mx-auto space-y-12 pb-16">
        <h1 className="text-5xl font-extrabold text-purple-400 mb-10 text-center tracking-wide" data-aos="fade-down">
          Contact Us
        </h1>

        <p className="text-lg leading-relaxed text-gray-300 mb-12 text-center" data-aos="fade-up" data-aos-delay="100">
          Have questions or need support? We're here to help you with all your home service needs.
        </p>

        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-purple-400 text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-300">support@handyconnect.com</p>
            <p className="text-gray-400 text-sm mt-2">We'll respond within 24 hours</p>
          </div>

          <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-purple-400 text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-300">+91 98765 43210</p>
            <p className="text-gray-400 text-sm mt-2">Mon-Sat, 9 AM - 8 PM</p>
          </div>

          <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-purple-400 text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-300">123, Service Lane</p>
            <p className="text-gray-300">Your City, India</p>
          </div>
        </div>

        {/* FAQ Section */}
        <section data-aos="fade-up" data-aos-delay="300" className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-purple-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center tracking-wide">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">How do I book a service?</h3>
              <p className="text-gray-300">Simply browse our services on the homepage, select what you need, and book instantly through our platform.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Are all workers verified?</h3>
              <p className="text-gray-300">Yes, all our professionals undergo thorough background checks and verification processes for your safety and peace of mind.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">What if I'm not satisfied with the service?</h3>
              <p className="text-gray-300">We offer a satisfaction guarantee. Contact our support team, and we'll work to resolve any issues promptly.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">How are the service charges calculated?</h3>
              <p className="text-gray-300">Our pricing is transparent with no hidden fees. You'll see the exact cost before confirming your booking.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section data-aos="fade-up" data-aos-delay="400" className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-lg mb-6 text-purple-100">
            Our customer support team is ready to help you with any questions or concerns
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={() => window.location.href = 'tel:+919876543210'}
              className="w-full sm:w-auto bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              Call Now
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Browse Services
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
