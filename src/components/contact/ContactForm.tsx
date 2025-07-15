import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import StylishDropdown from '../common/StylishDropdown';
import contactService, { CreateContactData } from '../../services/contactService';
import packageService, { Package } from '../../services/packageService';

const ContactForm = () => {
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    phone: '+91',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<CreateContactData & { package: string }>>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  useEffect(() => {
    packageService.getAll().then(data => {
      setPackages(data.packages);
    }).catch(error => {
      console.error('Error loading packages:', error);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CreateContactData) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof CreateContactData]) {
      setErrors((prev: Partial<CreateContactData>) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateContactData & { package: string }> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.phone && formData.phone.replace('+91', '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits (excluding country code)';
    }
    
    if (formData.location && formData.location.length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    // Validate package selection
    if (!selectedPackage) {
      newErrors.package = 'Please select a package';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for API - only include non-empty optional fields
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        ...(formData.phone?.trim() && { phone: formData.phone.trim() }),
        ...(formData.location?.trim() && { location: formData.location.trim() }),
        package_id: selectedPackage,
      };
      
      await contactService.submitContact(payload);
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '+91',
        location: '',
        message: '',
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your message has been sent successfully. We'll get back to you as soon as possible.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-300">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="johndoe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+91 9876543210"
              minLength={13}
              maxLength={15}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mumbai, Maharashtra"
              minLength={2}
              maxLength={100}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>
          
          <div className="mb-6">
            <StylishDropdown
              options={packages.map(pkg => ({
                id: pkg.id,
                name: pkg.name,
                description: pkg.note,
                popular: pkg.name.toLowerCase().includes('advance')
              }))}
              value={selectedPackage}
              onChange={(value) => {
                setSelectedPackage(value);
                // Clear package error when a package is selected
                if (errors.package) {
                  setErrors(prev => ({ ...prev, package: undefined }));
                }
              }}
              placeholder="Choose a package"
              label="Select Package"
              error={errors.package}
              required={true}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Message*
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your event, questions, or special requests..."
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            icon={<Send size={18} />}
          >
            Send Message
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;