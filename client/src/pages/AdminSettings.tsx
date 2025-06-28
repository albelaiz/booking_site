
import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminSettings = () => {
  return (
    <AdminLayout title="General Settings" currentPath="/admin/settings">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-6">System Settings</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-md font-medium mb-4">Site Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="Martil Haven"
                />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="Luxury vacation rentals in Martil"
                />
              </div>
            </div>
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-md font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="info@bayhaven.com"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="+1 (234) 567-8900"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-4">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="https://facebook.com/martilhaven"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="https://instagram.com/martilhaven"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="px-4 py-2 bg-moroccan-blue text-white rounded-md hover:bg-moroccan-blue/90">
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
