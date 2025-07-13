import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  description?: string;
  price?: string;
  popular?: boolean;
}

interface StylishDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

const StylishDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  required = false,
  className = ""
}: StylishDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left bg-white dark:bg-gray-700 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {selectedOption ? (
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-gray-900 dark:text-white font-medium truncate">
                        {selectedOption.name}
                      </span>
                      {selectedOption.popular && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    {selectedOption.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {selectedOption.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                {options.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No options available
                  </div>
                ) : (
                  options.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150 ${
                        value === option.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      whileHover={{ backgroundColor: value === option.id ? undefined : '#f9fafb' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className={`font-medium truncate ${
                              value === option.id 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {option.name}
                            </span>
                            {option.popular && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {option.description}
                            </p>
                          )}
                          {option.price && (
                            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                              {option.price}
                            </p>
                          )}
                        </div>
                        {value === option.id && (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default StylishDropdown; 