import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, CreditCard, Package, Clock, MessageCircle } from 'lucide-react';
import Section from '../components/common/Section';

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon: React.ReactNode;
}

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 'location',
      question: 'Where are we based and do we travel for weddings?',
      answer: 'We are based in Mumbai, but we love capturing love stories wherever they unfold! Whether your wedding is in local or a destination celebration, we are happy to travel to document your special day.',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      id: 'booking',
      question: 'How can you book us?',
      answer: (
        <div className="space-y-3">
          <p>DM us or You Can WhatsApp Us.</p>
          <p className="font-semibold text-blue-600 dark:text-blue-400">
            We recommend booking us 6–8 months prior.
          </p>
        </div>
      ),
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      id: 'pricing',
      question: 'How much do we charge & what are the payment terms?',
      answer: (
        <div className="space-y-4">
          <p>
            Every wedding we capture has a different vibe, so the cost of your photography and films is tailored to fit the scope of work. We offer different packages as per your events and needs, and to create the perfect package, we'd love to learn more about your story, your vision for the wedding, and details like the event flow and guest count.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Payment Terms</h4>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200">
              <li>• 50% at the time of the booking</li>
              <li>• 50% on the event day</li>
            </ul>
          </div>
        </div>
      ),
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'delivery',
      question: 'What do we deliver?',
      answer: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Photos:
            </h4>
            <ul className="space-y-1 text-green-800 dark:text-green-200">
              <li>• Up to 50–60 edited couple and solo pics</li>
              <li>• A perfect design album</li>
              <li>• Photos accessible via Google Drive link or Pen Drive</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Films:
            </h4>
            <ul className="space-y-1 text-purple-800 dark:text-purple-200">
              <li>• A 3–5 minute cinematic video</li>
              <li>• 40–60 seconds teaser of the wedding event</li>
              <li>• Full film and coverage of sangeet or other performances, if any</li>
            </ul>
          </div>
        </div>
      ),
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 'timeline',
      question: 'What are delivery timelines?',
      answer: (
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Photos:
            </h4>
            <p className="text-orange-800 dark:text-orange-200">
              We deliver your complete album setup within 25–30 days of the event.
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Films:
            </h4>
            <p className="text-red-800 dark:text-red-200">
              Wedding films usually take up to 50–60 days to deliver. At the end of this process, you will receive a Google Drive link or Pen Drive.
            </p>
          </div>
        </div>
      ),
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Questions</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Everything you need to know about our photography services, booking process, and what to expect.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <Section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      openItem === item.id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                <AnimatePresence>
                  {openItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              We're here to help! Get in touch with us for personalized answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919011807148"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Contact Form
              </a>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default FAQ; 