
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-moroccan-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Information */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-5">
              <div className="bg-moroccan-blue text-white p-2.5 rounded-lg shadow-md">
                <span className="font-serif text-lg">B</span>
              </div>
              <div className="font-serif text-xl text-white">
                <span className="text-sky-900">Bay</span>
                <span className="text-moroccan-gold">Haven</span>
              </div>
            </Link>
            <p className="text-sm mb-6 leading-relaxed text-[rgb(107_114_128)] font-bold">
              Discover beautiful vacation properties in BayHaven, Morocco. Experience the perfect blend of Moroccan hospitality and modern luxury on the Mediterranean coast.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-500 hover:text-moroccan-gold transition duration-200">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-moroccan-gold transition duration-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-moroccan-gold transition duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-moroccan-gold">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/owner-dashboard" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-moroccan-gold">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help-center" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/cancellation-options" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link to="/safety-information" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Safety Information
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-500 hover:text-moroccan-gold transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-moroccan-gold rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-moroccan-gold">Contact Us</h3>
            <address className="not-italic text-gray-500 space-y-4">
              <p className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-moroccan-gold mt-0.5" />
                <span>Boulevard Mohammed V<br />BayHaven, Morocco</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-moroccan-gold" />
                <a href="mailto:info@bayhaven.com" className="hover:text-moroccan-gold transition-colors">info@bayhaven.com</a>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-moroccan-gold" />
                <a href="tel:+212654698554" className="hover:text-moroccan-gold transition-colors">+212 654698554</a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} BayHaven. All rights reserved.</p>
          <div className="mt-3 space-x-6">
            <Link to="/privacy-policy" className="hover:text-moroccan-gold transition duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-moroccan-gold transition duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
