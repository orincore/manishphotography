import { motion } from 'framer-motion';

const DashboardChart = () => {
  // Mocked data for the chart
  // In a real application, you would use a library like Chart.js, Recharts, etc.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const inquiryData = [12, 19, 15, 22, 30, 25, 33, 28, 24, 31, 28, 35];
  const bookingData = [8, 12, 10, 15, 18, 16, 20, 18, 16, 19, 17, 22];
  
  // Find the max value to normalize the heights
  const maxValue = Math.max(...inquiryData, ...bookingData);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inquiries & Bookings</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Inquiries</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Bookings</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-2">
        {months.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex justify-center space-x-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(inquiryData[index] / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.05 }}
                className="w-3 bg-blue-500 rounded-t-sm"
              ></motion.div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(bookingData[index] / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.1 }}
                className="w-3 bg-green-500 rounded-t-sm"
              ></motion.div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardChart;