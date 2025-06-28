
import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminSystem = () => {
  return (
    <AdminLayout title="System" currentPath="/admin/system">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-6">System Information</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-md font-medium mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Application Version
                </span>
                <div className="p-2 bg-gray-50 rounded-md">1.0.0</div>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </span>
                <div className="p-2 bg-gray-50 rounded-md">Production</div>
              </div>
            </div>
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-md font-medium mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Last Backup
                </span>
                <div className="p-2 bg-gray-50 rounded-md">2025-05-18 04:30 UTC</div>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  System Status
                </span>
                <div className="flex items-center p-2 bg-green-50 text-green-700 rounded-md">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-4">Database Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Database Size
                </span>
                <div className="p-2 bg-gray-50 rounded-md">24.5 MB</div>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Total Records
                </span>
                <div className="p-2 bg-gray-50 rounded-md">1,248</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <button className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100">
            Run System Diagnostics
          </button>
          
          <button className="w-full md:w-auto px-4 py-2 bg-green-50 text-green-700 border border-green-300 rounded-md hover:bg-green-100">
            Backup Database
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystem;
