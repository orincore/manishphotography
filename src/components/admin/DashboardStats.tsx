import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStatsProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'pink' | 'red';
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType = 'neutral'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    red: 'bg-red-500'
  };

  const changeColorClasses = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : '0'}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'positive' ? (
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown size={16} className="text-red-600 dark:text-red-400 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;