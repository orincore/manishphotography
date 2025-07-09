import React from 'react';

const DashboardChart: React.FC = () => {
  // Mock data for the chart
  const chartData = [
    { day: 'Mon', views: 120 },
    { day: 'Tue', views: 180 },
    { day: 'Wed', views: 150 },
    { day: 'Thu', views: 220 },
    { day: 'Fri', views: 190 },
    { day: 'Sat', views: 280 },
    { day: 'Sun', views: 250 }
  ];

  const maxViews = Math.max(...chartData.map(d => d.views));

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between h-32 space-x-2">
        {chartData.map((data, index) => {
          const height = (data.views / maxViews) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div
                  className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                  {data.views} views
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {data.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {chartData.reduce((sum, data) => sum + data.views, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(chartData.reduce((sum, data) => sum + data.views, 0) / chartData.length).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;