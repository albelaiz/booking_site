// Admin Property Review Component
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, User, MapPin, DollarSign, Bed, Bath, Users } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  images: string[];
  amenities: string[];
  rules: string;
  status: string;
  createdAt: string;
  host: {
    id: number;
    name: string;
    email: string;
  };
}

export const AdminPropertyReview: React.FC = () => {
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/properties/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending properties');
      }

      const data = await response.json();
      setPendingProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch pending properties'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyReview = async (propertyId: number, action: 'approve' | 'reject', rejectionReason?: string) => {
    setProcessingId(propertyId);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/properties/${propertyId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          rejectionReason: rejectionReason || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} property`);
      }

      const data = await response.json();
      
      setMessage({
        type: 'success',
        text: `Property ${action}ed successfully! ${action === 'approve' ? 'It\'s now live on the platform.' : 'Host has been notified.'}`
      });

      // Remove the property from pending list
      setPendingProperties(prev => prev.filter(p => p.id !== propertyId));

    } catch (error) {
      console.error(`Error ${action}ing property:`, error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : `Failed to ${action} property`
      });
    } finally {
      setProcessingId(null);
    }
  };

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Property Images */}
        {property.images && property.images.length > 0 && (
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {property.images[0] ? (
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                No image
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <User className="w-4 h-4 mr-1" />
                Host: {property.host.name}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                Submitted: {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              Pending
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              ${property.price}/night
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms} bed
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms} bath
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <Users className="w-4 h-4 mr-1" />
            Up to {property.capacity} guests
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 6).map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 6 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    +{property.amenities.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* House Rules */}
          {property.rules && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">House Rules</h4>
              <p className="text-gray-600 text-sm">{property.rules}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handlePropertyReview(property.id, 'approve')}
              disabled={processingId === property.id}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {processingId === property.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processingId === property.id}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reject Property</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this property. This will help the host improve their submission.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handlePropertyReview(property.id, 'reject', rejectionReason);
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Property
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        Loading pending properties...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Review Dashboard</h1>
        <p className="text-gray-600">Review and approve properties submitted by hosts</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {pendingProperties.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Properties</h3>
          <p className="text-gray-600">All properties have been reviewed. New submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {pendingProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
