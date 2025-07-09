import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Star, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import StaffLayout from '../components/StaffLayout';
import { useTestimonials, Testimonial } from '../contexts/TestimonialsContext';

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, loading, error } = useTestimonials();
  const userRole = localStorage.getItem('userRole');
  const isStaff = userRole === 'staff';

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    avatar: '',
    propertyStayed: ''
  });

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
  };

  const handleSave = () => {
    if (editingId) {
      updateTestimonial(editingId, formData);
      setEditingId(null);
    } else {
      addTestimonial(formData as Omit<Testimonial, 'id'>);
      setShowAddForm(false);
    }
    setFormData({
      name: '',
      location: '',
      rating: 5,
      comment: '',
      avatar: '',
      propertyStayed: ''
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      location: '',
      rating: 5,
      comment: '',
      avatar: '',
      propertyStayed: ''
    });
  };

  if (loading) {
    const LayoutComponent = isStaff ? StaffLayout : AdminLayout;
    return (
      <LayoutComponent title="Testimonials Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading testimonials...</span>
        </div>
      </LayoutComponent>
    );
  }

  if (error) {
    const LayoutComponent = isStaff ? StaffLayout : AdminLayout;
    return (
      <LayoutComponent title="Testimonials Management">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </LayoutComponent>
    );
  }

  const LayoutComponent = isStaff ? StaffLayout : AdminLayout;

  return (
    <LayoutComponent title="Testimonials Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
            <p className="text-gray-600 mt-2">Manage what guests say about TamudaStay</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Add New Testimonial Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Testimonial</CardTitle>
              <CardDescription>Add a new guest testimonial to the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Guest Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter guest name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, USA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Property Stayed</label>
                  <Input
                    value={formData.propertyStayed || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyStayed: e.target.value }))}
                    placeholder="e.g., Oceanview Villa Martil"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Avatar URL</label>
                  <Input
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Testimonial Comment</label>
                  <Textarea
                    value={formData.comment || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Enter the guest's testimonial..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Testimonial
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === testimonial.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Name"
                      />
                      <Input
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Location"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={formData.rating || 5}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <Input
                        value={formData.propertyStayed || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, propertyStayed: e.target.value }))}
                        placeholder="Property"
                      />
                    </div>
                    <Input
                      value={formData.avatar || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="Avatar URL"
                    />
                    <Textarea
                      value={formData.comment || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    {testimonial.propertyStayed && (
                      <div className="mb-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {testimonial.propertyStayed}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-700 text-sm">{testimonial.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LayoutComponent>
  );
};

export default AdminTestimonials;
