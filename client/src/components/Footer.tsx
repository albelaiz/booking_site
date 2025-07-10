
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Beautiful Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="section-content relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Enhanced Brand Information */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="logo-gradient text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="font-serif text-lg font-bold tracking-wide">BH</span>
                </div>
                <div className="absolute inset-0 bg-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="font-serif">
                <div className="flex items-baseline">
                  <span className="text-white text-xl font-bold tracking-wide">Bay</span>
                  <span className="text-blue-400 text-xl font-bold ml-1 tracking-wide">Haven</span>
                </div>
                <span className="text-xs text-gray-400 tracking-widest uppercase font-sans">Morocco</span>
              </div>
            </Link>
            <p className="text-sm mb-6 leading-relaxed text-gray-400 font-normal">
              Discover beautiful vacation properties in TamudaStay, Morocco. Experience the perfect blend of Moroccan hospitality and modern luxury on the Mediterranean coast.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-blue-400">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-blue-400">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help-center" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/cancellation-options" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link to="/safety-information" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Safety Information
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-blue-400">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-4">
              {/* <p className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-400 mt-0.5" />
                <span>Boulevard Mohammed V<br />TamudaStay, Morocco</span>
              </p> */}
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <a href="mailto:tamudastay@gmail.com" className="hover:text-blue-400 transition-colors">tamudastay@gmail.com</a>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <a href="tel:+212654698554" className="hover:text-blue-400 transition-colors">+212 654698554</a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} TamudaStay. All rights reserved.</p>
          <div className="mt-3 space-x-6">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-blue-400 transition duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
