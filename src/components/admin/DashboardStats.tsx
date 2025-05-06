import { motion } from 'framer-motion';
import { 
  Users, 
  Image, 
  MessageSquare, 
  Calendar
} from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '452',
      change: '+12%',
      positive: true,
      icon: <Users size={20} className="text-blue-500" />,
      color: 'blue',
    },
    {
      title: 'Portfolio Items',
      value: '64',
      change: '+4%',
      positive: true,
      icon: <Image size={20} className="text-green-500" />,
      color: 'green',
    },
    {
      title: 'New Inquiries',
      value: '28',
      change: '-5%',
      positive: false,
      icon: <MessageSquare size={20} className="text-yellow-500" />,
      color: 'yellow',
    },
    {
      title: 'Upcoming Bookings',
      value: '15',
      change: '+20%',
      positive: true,
      icon: <Calendar size={20} className="text-purple-500" />,
      color: 'purple',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 ${
            stat.color === 'blue' ? 'border-blue-500' :
            stat.color === 'green' ? 'border-green-500' :
            stat.color === 'yellow' ? 'border-yellow-500' :
            'border-purple-500'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">{stat.title}</h3>
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {stat.icon}
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mr-2">{stat.value}</p>
            <p className={`text-sm font-medium ${
              stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {stat.change}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStats;