import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '../data/properties';
import { propertiesApi } from "../lib/api";

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => Promise<any>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
  loading: boolean;
}

// Export the context so it can be imported directly
export const PropertiesContext = createContext<PropertiesContextType>({
  properties: [],
  addProperty: async () => {},
  updateProperty: async () => {},
  deleteProperty: async () => {},
  refreshProperties: async () => {},
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
      const data = await propertiesApi.getAll();
      setPropertiesList(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    
    // Set up periodic refresh to sync properties across devices
    const interval = setInterval(() => {
      fetchProperties();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const addProperty = async (newProperty: Omit<Property, 'id'>) => {
    try {
      // First try to save to the API
      const savedProperty = await propertiesApi.create(newProperty);
      
      // If successful, refresh the properties list to get all properties from the database
      await fetchProperties();
      
      return savedProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      
      // Fallback: add to local state only if API fails
      const property: Property = {
        ...newProperty,
        id: `PROP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status: newProperty.status || 'pending' as 'pending',
      };

      setPropertiesList(prevProperties => [...prevProperties, property]);
      return property;
    }
  };

  const updateProperty = async (id: string, updatedFields: Partial<Property>) => {
    try {
      // Try to update via API first
      await propertiesApi.update(id, updatedFields);
      
      // If successful, refresh the properties list
      await fetchProperties();
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
      // Try to delete via API first
      await propertiesApi.delete(id);
      
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

  const value = {
    properties: propertiesList,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: fetchProperties,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};