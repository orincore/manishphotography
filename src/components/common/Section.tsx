import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  darkBg?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  className = '',
  id,
  fullWidth = false,
  darkBg = false,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${
        darkBg ? 'bg-gray-900 text-white' : 'bg-white dark:bg-gray-900 dark:text-white'
      } ${className}`}
    >
      <div className={fullWidth ? 'w-full' : 'container mx-auto px-4'}>
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            {title && (
              <motion.h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  darkBg ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
                variants={itemVariants}
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                className={`text-lg max-w-2xl mx-auto ${
                  darkBg ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;