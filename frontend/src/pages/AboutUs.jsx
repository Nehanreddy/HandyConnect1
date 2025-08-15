import React from 'react';

const AboutUs = () => {
  return (
    // Outer container with purple gradient background matching homepage
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-gray-200 pt-20">
      {/* Inner container constrains the content width and adds padding */}
      <div className="pt-8 px-6 max-w-4xl mx-auto space-y-12 pb-16"> {/* Added pb-16 for bottom padding */}
        <h1
          className="text-5xl font-extrabold text-purple-400 mb-8 text-center tracking-wide"
          data-aos="fade-down"
        >
          About Handy Connect
        </h1>

        <section data-aos="fade-up" data-aos-delay="100" className="space-y-4">
          <p className="text-lg leading-relaxed text-gray-300">
            At <span className="font-semibold text-purple-400">Handy Connect</span>, we pride ourselves on being
            the premier platform for on-demand home services. Our goal is to bridge the gap between
            homeowners and highly skilled, vetted professionals in plumbing, electrical work,
            carpentry, painting, and beyond.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            We understand that household maintenance can be a hassle — finding quality service providers can
            be time-consuming and stressful. That's why our platform simplifies the process: within just a few clicks,
            you can book trustworthy experts who deliver timely and reliable service.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            Transparency, trust, and innovation are at the core of our values. Every professional on our platform
            undergoes a rigorous verification process to ensure you receive the best service possible. Through
            continuous technology-driven improvements, Handy Connect offers convenience and peace of mind,
            empowering thousands of customers to maintain beautiful and functional homes.
          </p>
        </section>

        {/* Vision Section */}
        <section data-aos="fade-up" data-aos-delay="200" className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-purple-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-4 tracking-wide">Our Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            To become the most trusted and innovative home services platform, revolutionizing how homeowners
            connect with reliable professionals, making home maintenance effortless and accessible to all.
          </p>
        </section>

        {/* Mission Section */}
        <section data-aos="fade-up" data-aos-delay="300" className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-purple-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-4 tracking-wide">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            To transform the way people access home services by delivering quick, reliable, and professional
            solutions that enhance everyday living.
          </p>
        </section>

        {/* What We Provide Section */}
        <section data-aos="fade-up" data-aos-delay="400" className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-purple-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-4 tracking-wide">What We Provide</h2>
          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-300">Access to a wide range of trusted home service professionals including plumbers, electricians, carpenters, painters, and appliance repair experts.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-300">Simple and user-friendly booking platform available anytime, anywhere.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-300">Verified and background-checked professionals for your safety and peace of mind.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-300">Transparent pricing with no hidden charges.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-300">Reliable and timely service guaranteed.</p>
            </div>
          </div>
        </section>

        {/* Why Handy Connect Section - FIXED: Changed to dark background */}
        <section data-aos="fade-up" data-aos-delay="500" className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-purple-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-4 tracking-wide">Why Handy Connect?</h2>
          <p className="text-gray-300 leading-relaxed">
            Because we put your convenience and trust first. With an easy-to-use platform, vetted professionals, transparent pricing,
            and fast bookings, Handy Connect is your go-to solution for all home maintenance and repair needs.
            Join thousands of satisfied customers who have made seamless home service booking a reality.
          </p>
        </section>

        {/* Call to Action Section */}
        <section data-aos="fade-up" data-aos-delay="600" className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-lg mb-6 text-purple-100">
            Join thousands of satisfied customers who trust Handy Connect for all their home service needs
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section data-aos="fade-up" data-aos-delay="700" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-900 rounded-lg p-6 border border-purple-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-gray-300">Verified Professionals</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-purple-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">10,000+</div>
            <div className="text-gray-300">Services Completed</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-purple-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">4.8★</div>
            <div className="text-gray-300">Customer Rating</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
