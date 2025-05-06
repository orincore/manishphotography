import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Tag } from 'lucide-react';
import { blogPosts } from '../data/blog';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  useEffect(() => {
    // Update page title
    document.title = 'Blog - Manish Photography';
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      blogPosts.flatMap((post) => post.tags || [])
    )
  );
  
  // Filter blog posts based on search term and selected tag
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === '' || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });
  
  const featuredPosts = blogPosts.filter(post => post.featured);

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
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Blog" subtitle="Photography tips, tricks, and insights from our team">
        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Post</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/blog/${featuredPosts[0].slug}`}>
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="h-64 md:h-auto">
                      <img
                        src={featuredPosts[0].coverImage}
                        alt={featuredPosts[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Clock size={16} className="mr-1" />
                        <span className="mr-4">{featuredPosts[0].date}</span>
                        <User size={16} className="mr-1" />
                        <span>{featuredPosts[0].author.name}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {featuredPosts[0].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {featuredPosts[0].excerpt}
                      </p>
                      <div className="flex items-center space-x-2">
                        {featuredPosts[0].tags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        )}
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="w-full md:w-1/2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Blog Posts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Link to={`/blog/${post.slug}`}>
                <Card>
                  <Card.Image
                    src={post.coverImage}
                    alt={post.title}
                    aspectRatio="video"
                  />
                  <Card.Content>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Clock size={14} className="mr-1" />
                      <span className="mr-3">{post.readTime}</span>
                      <User size={14} className="mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Description className="mb-4">{post.excerpt}</Card.Description>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try changing your search term or filter
            </p>
          </div>
        )}
      </Section>
    </div>
  );
};

export default Blog;