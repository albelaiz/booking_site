import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '../data/properties';
import { propertiesApi } from "../lib/api";
import { auditLogger } from '../lib/auditLogger';

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => Promise<any>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  loading: boolean;
}

// Export the context so it can be imported directly
export const PropertiesContext = createContext<PropertiesContextType>({
  properties: [],
  addProperty: async () => {},
  updateProperty: async () => {},
  deleteProperty: async () => {},
  approveProperty: async () => {},
  rejectProperty: async () => {},
  refreshProperties: async () => {},
  forceRefresh: async () => {},
  loading: false
});

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');

      let endpoint = '/api/properties/public'; // Default to public properties
      let headers: HeadersInit = {};

      // Determine which endpoint to use based on user role
      if (userRole === 'admin' && authToken) {
        endpoint = '/api/admin/properties';
        headers = {
          'Authorization': authToken,
          'x-user-id': userId || '',
          'x-user-role': userRole
        };
      } else if ((userRole === 'owner' || userRole === 'host') && authToken && userId) {
        endpoint = `/api/host/properties/owner/${userId}`;
        headers = {
          'Authorization': authToken,
          'x-user-id': userId,
          'x-user-role': userRole
        };
      }

      const response = await fetch(endpoint, { headers });
      if (response.ok) {
        const data = await response.json();
        setPropertiesList(data);
      } else {
        console.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Listen for storage changes (like logout)
    const handleStorageChange = () => {
      fetchProperties();
    };

    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchProperties();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const addProperty = async (newProperty: Omit<Property, 'id'>) => {
    try {
      const userId = parseInt(localStorage.getItem('userId') || '1');
      const userRole = localStorage.getItem('userRole') || '';

      // Auto-approve properties created by admin or staff
      const propertyToCreate = {
        ...newProperty,
        status: (userRole === 'admin' || userRole === 'staff') ? 'approved' : (newProperty.status || 'pending')
      };

      console.log(`Creating property with status: ${propertyToCreate.status} for role: ${userRole}`);

      // First try to save to the API
      const savedProperty = await propertiesApi.create(propertyToCreate);

      // Log the audit action
      await auditLogger.logPropertyAction(
        'property_created',
        savedProperty,
        userId
      );

      // Single refresh to get fresh data from database
      await fetchProperties();

      console.log(`✅ Property created: ${savedProperty.title} (Status: ${savedProperty.status})`);

      return savedProperty;
    } catch (error) {
      console.error('Error adding property:', error);

      // Fallback: add to local state only if API fails
      const userRole = localStorage.getItem('userRole') || '';
      const property: Property = {
        ...newProperty,
        id: `PROP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status: (userRole === 'admin' || userRole === 'staff') ? 'approved' : 'pending' as 'pending',
      };

      setPropertiesList(prevProperties => [...prevProperties, property]);
      return property;
    }
  };

  const updateProperty = async (id: string, updatedFields: Partial<Property>) => {
    try {
      // Get current property for audit logging
      const currentProperty = propertiesList.find(p => p.id === id);
      const userId = parseInt(localStorage.getItem('userId') || '1');

      // Try to update via API first
      await propertiesApi.update(id, updatedFields);

      // Log the audit action
      if (currentProperty) {
        const updatedProperty = { ...currentProperty, ...updatedFields };

        // Determine specific action based on what changed
        let action = 'property_updated';
        if (updatedFields.status && updatedFields.status !== currentProperty.status) {
          if (updatedFields.status === 'approved') {
            action = 'property_approved';
          } else if (updatedFields.status === 'rejected') {
            action = 'property_rejected';
          } else {
            action = 'property_status_changed';
          }
        } else if (updatedFields.featured !== undefined && updatedFields.featured !== currentProperty.featured) {
          action = updatedFields.featured ? 'property_featured' : 'property_unfeatured';
        }

        await auditLogger.logPropertyAction(
          action,
          updatedProperty,
          userId,
          currentProperty
        );
      }

      // Single refresh to get fresh data from database
      await fetchProperties();

      console.log(`✅ Property updated: ${currentProperty?.title || id}`);
    } catch (error) {
      console.error('Error updating property:', error);

      // Fallback: update local state only
      setPropertiesList(prevProperties => 
        prevProperties.map(property => 
          property.id === id ? { ...property, ...updatedFields } : property
        )
      );
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      // Get current property for audit logging
      const currentProperty = propertiesList.find(p => p.id === id);
      const userId = parseInt(localStorage.getItem('userId') || '1');

      // Try to delete via API first
      await propertiesApi.delete(id);

      // Log the audit action
      if (currentProperty) {
        await auditLogger.logPropertyAction(
          'property_deleted',
          currentProperty,
          userId
        );
      }

      // If successful, refresh the properties list
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);

      // Fallback: update local state only
      setPropertiesList(prevProperties => 
        prevProperties.filter(property => property.id !== id)
      );
    }
  };

  const approveProperty = async (id: string) => {
    try {
      const currentProperty = propertiesList.find(p => p.id === id);
      const userId = parseInt(localStorage.getItem('userId') || '1');

      // Call API to approve property
      await propertiesApi.approve(id);

      // Log the audit action
      if (currentProperty) {
        await auditLogger.logPropertyAction(
          'property_approved',
          { ...currentProperty, status: 'approved' },
          userId
        );
      }

      // Single refresh to get fresh data from database
      await fetchProperties();

      console.log(`✅ Property approved: ${currentProperty?.title || id}`);
    } catch (error) {
      console.error('Error approving property:', error);

      // Fallback: update local state only
      setPropertiesList(prevProperties => 
        prevProperties.map(property => 
          property.id === id ? { ...property, status: 'approved' } : property
        )
      );
    }
  };

  const rejectProperty = async (id: string) => {
    try {
      const currentProperty = propertiesList.find(p => p.id === id);
      const userId = parseInt(localStorage.getItem('userId') || '1');

      // Call API to reject property
      await propertiesApi.reject(id);

      // Log the audit action
      if (currentProperty) {
        await auditLogger.logPropertyAction(
          'property_rejected',
          { ...currentProperty, status: 'rejected' },
          userId
        );
      }

      // Refresh properties to get updated data
      await fetchProperties();
    } catch (error) {
      console.error('Error rejecting property:', error);

      // Fallback: update local state only
      setPropertiesList(prevProperties => 
        prevProperties.map(property => 
          property.id === id ? { ...property, status: 'rejected' } : property
        )
      );
    }
  };

  // Force refresh method for immediate updates
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing properties...');
    await fetchProperties();
  };

  const value = {
    properties: propertiesList,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    approveProperty,
    rejectProperty,
    refreshProperties: fetchProperties,
    forceRefresh,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};