import { motion } from 'framer-motion';

const GoogleMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="aspect-[4/3] md:aspect-auto md:h-full w-full">
        {/* Embedded Google Map - This is a placeholder iframe */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6044.898542917242!2d-74.00719137302276!3d40.7129406997215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a18c0a92069%3A0xca19af75a8dc12c1!2sFinancial%20District%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1636736675693!5m2!1sen!2sus"
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          title="Manish Photography Studio Location"
        ></iframe>
      </div>
    </motion.div>
  );
};

export default GoogleMap;