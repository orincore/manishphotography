import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  User,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Tag
} from 'lucide-react';
import contactService, { 
  ContactSubmission, 
  ContactFilters, 
  ContactStats,
  ContactSearchParams,
  BulkActionData
} from '../../services/contactService';
import packageService, { Package } from '../../services/packageService';
import { showNotification } from '../../utils/notifications';

interface ContactManagerProps {
  className?: string;
}

const ContactManager: React.FC<ContactManagerProps> = ({ className = '' }) => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);

  // Load contacts data
  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts(filters);
      setContacts(response.contacts);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading contacts:', error);
      showNotification('Error loading contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await contactService.getContactStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await contactService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Load packages
  const loadPackages = async () => {
    try {
      const response = await packageService.getAll();
      setPackages(response.packages);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  // Search contacts
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      loadContacts();
      return;
    }

    try {
      setLoading(true);
      setSearchMode(true);
      const response = await contactService.searchContacts({
        query: searchQuery.trim(),
        page: filters.page,
        limit: filters.limit
      });
      setContacts(response.contacts);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error searching contacts:', error);
      showNotification('Error searching contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and filter changes
  useEffect(() => {
    if (!searchMode) {
      loadContacts();
    }
  }, [filters, searchMode]);

  useEffect(() => {
    loadStats();
    loadUnreadCount();
    loadPackages();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
    setSelectedContacts([]); // Clear selection
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle contact status changes
  const handleMarkAsRead = async (contactId: string) => {
    try {
      await contactService.markAsRead(contactId);
      showNotification('Contact marked as read', 'success');
      loadContacts();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking contact as read:', error);
      showNotification('Error marking contact as read', 'error');
    }
  };

  const handleMarkAsUnread = async (contactId: string) => {
    try {
      await contactService.markAsUnread(contactId);
      showNotification('Contact marked as unread', 'success');
      loadContacts();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking contact as unread:', error);
      showNotification('Error marking contact as unread', 'error');
    }
  };

  const handleMarkAsResolved = async (contactId: string) => {
    try {
      await contactService.markAsResolved(contactId);
      showNotification('Contact marked as resolved', 'success');
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking contact as resolved:', error);
      showNotification('Error marking contact as resolved', 'error');
    }
  };

  const handleMarkAsWaste = async (contactId: string) => {
    try {
      await contactService.markAsWaste(contactId);
      showNotification('Contact marked as waste', 'success');
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking contact as waste:', error);
      showNotification('Error marking contact as waste', 'error');
    }
  };

  // Handle contact deletion
  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      await contactService.deleteContact(contactId);
      showNotification('Contact deleted successfully', 'success');
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error deleting contact:', error);
      showNotification('Error deleting contact', 'error');
    }
  };

  // Handle bulk operations
  const handleBulkMarkAsRead = async () => {
    if (selectedContacts.length === 0) {
      showNotification('Please select contacts to mark as read', 'warning');
      return;
    }

    try {
      const data: BulkActionData = { contactIds: selectedContacts };
      await contactService.bulkMarkAsRead(data);
      showNotification(`${selectedContacts.length} contacts marked as read`, 'success');
      setSelectedContacts([]);
      loadContacts();
      loadUnreadCount();
    } catch (error) {
      console.error('Error bulk marking as read:', error);
      showNotification('Error bulk marking as read', 'error');
    }
  };

  const handleBulkMarkAsResolved = async () => {
    if (selectedContacts.length === 0) {
      showNotification('Please select contacts to mark as resolved', 'warning');
      return;
    }

    try {
      const data: BulkActionData = { contactIds: selectedContacts };
      await contactService.bulkMarkAsResolved(data);
      showNotification(`${selectedContacts.length} contacts marked as resolved`, 'success');
      setSelectedContacts([]);
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error bulk marking as resolved:', error);
      showNotification('Error bulk marking as resolved', 'error');
    }
  };

  const handleBulkMarkAsWaste = async () => {
    if (selectedContacts.length === 0) {
      showNotification('Please select contacts to mark as waste', 'warning');
      return;
    }

    try {
      const data: BulkActionData = { contactIds: selectedContacts };
      await contactService.bulkMarkAsWaste(data);
      showNotification(`${selectedContacts.length} contacts marked as waste`, 'success');
      setSelectedContacts([]);
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error bulk marking as waste:', error);
      showNotification('Error bulk marking as waste', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      showNotification('Please select contacts to delete', 'warning');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedContacts.length} contact submissions?`)) return;

    try {
      const data: BulkActionData = { contactIds: selectedContacts };
      await contactService.bulkDeleteContacts(data);
      showNotification(`${selectedContacts.length} contacts deleted successfully`, 'success');
      setSelectedContacts([]);
      loadContacts();
      loadStats();
      loadUnreadCount();
    } catch (error) {
      console.error('Error bulk deleting contacts:', error);
      showNotification('Error bulk deleting contacts', 'error');
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Get status badge
  const getStatusBadge = (contact: ContactSubmission) => {
    switch (contact.status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Resolved
          </span>
        );
      case 'waste':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Waste
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  // Get read status badge
  const getReadStatusBadge = (contact: ContactSubmission) => {
    return contact.is_read ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Eye size={12} className="mr-1" />
        Read
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <EyeOff size={12} className="mr-1" />
        Unread
      </span>
    );
  };

  // Get package name by ID
  const getPackageName = (packageId: string | null | undefined) => {
    if (!packageId) return null;
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? pkg.name : null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contact Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage contact form submissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {unreadCount} unread
              </div>
            )}
            <button
              onClick={() => { 
                loadContacts(); 
                loadStats(); 
                loadUnreadCount();
                setSearchMode(false);
                setSearchQuery('');
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContacts}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <Mail size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.unreadContacts}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500 text-white">
                <EyeOff size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingContacts}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500 text-white">
                <AlertCircle size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolvedContacts}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <CheckCircle size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, location, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {searchMode && (
              <button
                onClick={() => {
                  setSearchMode(false);
                  setSearchQuery('');
                  loadContacts();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="waste">Waste</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Eye size={16} className="text-gray-500" />
              <select
                value={filters.readStatus || ''}
                onChange={(e) => handleFilterChange('readStatus', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Read Status</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedContacts.length} contacts selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkMarkAsResolved}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Mark as Resolved
              </button>
              <button
                onClick={handleBulkMarkAsWaste}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Mark as Waste
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact Submissions ({pagination.total})
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Select All</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-6 text-center">
            <Mail size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No contacts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !contact.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${
                  contact.status === 'waste' ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' : ''
                } ${
                  contact.status === 'resolved' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    className="mt-1 rounded border-gray-300 dark:border-gray-600"
                  />

                  {/* Contact Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {contact.name}
                          </h3>
                          {getStatusBadge(contact)}
                          {getReadStatusBadge(contact)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail size={14} />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone size={14} />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.location && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin size={14} />
                              <span>{contact.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock size={14} />
                            <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                          </div>
                          {contact.package_id && (
                            <div className="flex items-center space-x-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-700">
                              <Tag size={14} className="text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">Package: {getPackageName(contact.package_id) || contact.package_id}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare size={14} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</span>
                          </div>
                          <p className="text-gray-900 dark:text-white text-sm whitespace-pre-wrap">
                            {contact.message}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!contact.is_read ? (
                          <button
                            onClick={() => handleMarkAsRead(contact.id)}
                            className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Mark as Read"
                          >
                            <Eye size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsUnread(contact.id)}
                            className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
                            title="Mark as Unread"
                          >
                            <EyeOff size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkAsResolved(contact.id)}
                          className="p-2 text-green-600 hover:text-green-700 transition-colors"
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleMarkAsWaste(contact.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          title="Mark as Waste"
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager; 