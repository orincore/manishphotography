import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Section from '../components/common/Section';
import ContactForm from '../components/contact/ContactForm';
import GoogleMap from '../components/contact/GoogleMap';

const Contact = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Contact Us - Manish Photography';
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Contact Us" subtitle="Get in touch with us for your photography and cinematography needs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium">Our Studio</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Yadav Nagar, Shirgaon<br />
                      Badlapur East, Maharashtra<br />
                      India 421-503
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium">Phone</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      +91 901180848
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium">Email</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      manishbose94@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium">Working Hours</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <GoogleMap />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;