import { Instagram, Mail, Phone, MapPin, Lock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '../../Assets/logo/IMG_0040.JPG';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src={logoImage} 
                alt="Manish Photography Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
              />
              <span className="text-lg sm:text-xl font-bold text-white">Manish Photography</span>
            </Link>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Capturing life's beautiful moments through the art of photography and cinematography.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/manish_photogarphy_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://wa.me/919011807148"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'Wedding Photography', path: '/portfolio?category=photos&subcategory=wedding' },
                { label: 'Pre-Wedding Shoots', path: '/portfolio?category=photos&subcategory=pre-wedding' },
                { label: 'Wedding Films', path: '/portfolio?category=cinematics' },
                { label: 'Destination Weddings', path: '/offers' },
                { label: 'Commercial Photography', path: '/contact' },
                { label: 'Event Coverage', path: '/contact' },
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0 sm:w-5 sm:h-5" />
                <span className="text-gray-400 text-sm sm:text-base">
                  Yadav Nagar, Shirgaon<br />
                  Badlapur East, Maharashtra<br />
                  India 421-503
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-400 flex-shrink-0 sm:w-5 sm:h-5" />
                <a href="tel:+91901180848" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  +91 901180848
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-400 flex-shrink-0 sm:w-5 sm:h-5" />
                <a href="mailto:manishbose94@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  manishbose94@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-col items-center lg:items-start mb-4 lg:mb-0 text-center lg:text-left">
              <p className="text-gray-500 text-xs sm:text-sm mb-2">
                &copy; {currentYear} Manish Photography. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
                <span>Created with 💜 by</span>
                <a 
                  href="https://www.orincore.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center"
                >
                  Orincore Technologies
                  <ExternalLink size={10} className="ml-1 sm:w-3 sm:h-3" />
                </a>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 text-gray-500 text-xs sm:text-sm">
                <a 
                  href="https://www.orincore.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center"
                >
                  Website: www.orincore.com
                  <ExternalLink size={10} className="ml-1 sm:w-3 sm:h-3" />
                </a>
                <a 
                  href="https://instagram.com/ig_orincore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors flex items-center"
                >
                  Instagram: @ig_orincore
                  <ExternalLink size={10} className="ml-1 sm:w-3 sm:h-3" />
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/login" className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start">
                <Lock size={12} className="mr-1 sm:w-3 sm:h-4" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;