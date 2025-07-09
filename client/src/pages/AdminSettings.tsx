
import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Save, Globe, Mail, Users, Settings as SettingsIcon, Camera } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxFileUploadSize: number;
  allowedImageFormats: string[];
  maxImagesPerProperty: number;
  defaultCurrency: string;
  defaultLanguage: string;
  timezone: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Blue Bay Booking',
    siteDescription: 'Luxury vacation rentals and accommodations',
    contactEmail: 'info@bluebay.com',
    contactPhone: '+212 539 123 456',
    address: 'TamudaStay, Tetouan, Morocco',
    facebook: 'https://facebook.com/bluebay',
    instagram: 'https://instagram.com/bluebay',
    twitter: 'https://twitter.com/bluebay',
    linkedin: 'https://linkedin.com/company/bluebay',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileUploadSize: 5, // MB
    allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxImagesPerProperty: 10,
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    timezone: 'UTC',
    seoTitle: 'Blue Bay - Luxury Vacation Rentals',
    seoDescription: 'Discover luxury vacation rentals and accommodations with Blue Bay. Book your perfect getaway today.',
    seoKeywords: 'vacation rentals, luxury accommodations, booking, travel'
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      setLoading(true);
      try {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings. Using default values.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean | number | string[]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      // Validate required fields
      if (!settings.siteName || !settings.contactEmail) {
        toast({
          title: "Validation Error",
          description: "Site name and contact email are required.",
          variant: "destructive",
        });
        return;
      }

      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      
      // Also update the site title in the document
      document.title = settings.siteName;
      
      toast({
        title: "Settings Saved",
        description: "All settings have been successfully saved.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSettings({
        siteName: 'Blue Bay Booking',
        siteDescription: 'Luxury vacation rentals and accommodations',
        contactEmail: 'info@bluebay.com',
        contactPhone: '+212 539 123 456',
        address: 'TamudaStay, Tetouan, Morocco',
        facebook: 'https://facebook.com/bluebay',
        instagram: 'https://instagram.com/bluebay',
        twitter: 'https://twitter.com/bluebay',
        linkedin: 'https://linkedin.com/company/bluebay',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileUploadSize: 5,
        allowedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxImagesPerProperty: 10,
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
        timezone: 'UTC',
        seoTitle: 'Blue Bay - Luxury Vacation Rentals',
        seoDescription: 'Discover luxury vacation rentals and accommodations with Blue Bay. Book your perfect getaway today.',
        seoKeywords: 'vacation rentals, luxury accommodations, booking, travel'
      });
      
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="General Settings" currentPath="/admin/settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moroccan-blue mx-auto mb-4"></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="General Settings" currentPath="/admin/settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
            <p className="text-gray-600">Manage your site configuration and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetToDefaults}>
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={saveLoading}
              className="bg-moroccan-blue hover:bg-moroccan-blue/90"
            >
              {saveLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="system">
              <SettingsIcon className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Camera className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic information about your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name *</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="Enter site name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <select
                      id="defaultCurrency"
                      value={settings.defaultCurrency}
                      onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-moroccan-blue focus:border-moroccan-blue"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="MAD">MAD - Moroccan Dirham</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    placeholder="Brief description of your website"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <select
                      id="defaultLanguage"
                      value={settings.defaultLanguage}
                      onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-moroccan-blue focus:border-moroccan-blue"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={settings.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-moroccan-blue focus:border-moroccan-blue"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Africa/Casablanca">Africa/Casablanca</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How users can contact your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="info@yoursite.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your business address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                      id="facebook"
                      type="url"
                      value={settings.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      type="url"
                      value={settings.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      type="url"
                      value={settings.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={settings.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Configuration</CardTitle>
                  <CardDescription>System-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">
                        Enable maintenance mode to temporarily disable the site
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Allow User Registration</Label>
                      <p className="text-sm text-gray-500">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Require Email Verification</Label>
                      <p className="text-sm text-gray-500">
                        Require users to verify their email before account activation
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => handleInputChange('requireEmailVerification', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Settings</CardTitle>
                  <CardDescription>File upload configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                      <Input
                        id="maxFileUploadSize"
                        type="number"
                        min="1"
                        max="50"
                        value={settings.maxFileUploadSize}
                        onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxImagesPerProperty">Max Images Per Property</Label>
                      <Input
                        id="maxImagesPerProperty"
                        type="number"
                        min="1"
                        max="20"
                        value={settings.maxImagesPerProperty}
                        onChange={(e) => handleInputChange('maxImagesPerProperty', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Allowed Image Formats</Label>
                    <div className="flex flex-wrap gap-2">
                      {['jpg', 'jpeg', 'png', 'webp', 'gif'].map((format) => (
                        <label key={format} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settings.allowedImageFormats.includes(format)}
                            onChange={(e) => {
                              const formats = e.target.checked
                                ? [...settings.allowedImageFormats, format]
                                : settings.allowedImageFormats.filter(f => f !== format);
                              handleInputChange('allowedImageFormats', formats);
                            }}
                            className="rounded border-gray-300 text-moroccan-blue focus:ring-moroccan-blue"
                          />
                          <span className="text-sm">{format.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Configuration</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={settings.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Your site title for search engines"
                    maxLength={60}
                  />
                  <p className="text-sm text-gray-500">
                    {settings.seoTitle.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={settings.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="Brief description for search engines"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    {settings.seoDescription.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Textarea
                    id="seoKeywords"
                    value={settings.seoKeywords}
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                    placeholder="Comma-separated keywords (e.g., vacation rentals, booking, travel)"
                    rows={2}
                  />
                  <p className="text-sm text-gray-500">
                    Separate keywords with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
