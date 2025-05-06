import { useSearchParams } from 'react-router-dom';

interface PortfolioFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeSubcategory: string;
  setActiveSubcategory: (subcategory: string) => void;
}

const PortfolioFilter: React.FC<PortfolioFilterProps> = ({
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    searchParams.set('category', category);
    
    // Reset subcategory when changing categories
    if (category !== 'photos') {
      searchParams.delete('subcategory');
      setActiveSubcategory('');
    }
    
    setSearchParams(searchParams);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    
    if (subcategory) {
      searchParams.set('subcategory', subcategory);
    } else {
      searchParams.delete('subcategory');
    }
    
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Category</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleCategoryChange('photos')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === 'photos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Photography
            </button>
            <button
              onClick={() => handleCategoryChange('cinematics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === 'cinematics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Cinematography
            </button>
          </div>
        </div>

        {activeCategory === 'photos' && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Type</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSubcategoryChange('')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeSubcategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleSubcategoryChange('wedding')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeSubcategory === 'wedding'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Wedding
              </button>
              <button
                onClick={() => handleSubcategoryChange('pre-wedding')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeSubcategory === 'pre-wedding'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Pre-Wedding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioFilter;