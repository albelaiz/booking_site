import { useState } from 'react';
import { Button } from '../components/ui/button';
import EnhancedAuthModal from '../components/EnhancedAuthModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserPlus, Users, Settings, Star, Shield, Zap } from 'lucide-react';

const EnhancedAuthDemo = () => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [suggestedRole, setSuggestedRole] = useState<'user' | 'owner'>('user');

  const handleOpenModal = (mode: 'login' | 'signup', role: 'user' | 'owner' = 'user') => {
    setAuthMode(mode);
    setSuggestedRole(role);
    setShowModal(true);
  };

  const handleAuthSuccess = () => {
    setShowModal(false);
    alert('Authentication successful! This is just a demo.');
  };

  const features = [
    {
      icon: <UserPlus className="h-6 w-6 text-blue-600" />,
      title: "Multi-Step Registration",
      description: "Break down the signup process into manageable steps to reduce abandonment"
    },
    {
      icon: <Settings className="h-6 w-6 text-green-600" />,
      title: "Flexible Requirements",
      description: "Email is optional but encouraged, with clear explanations of benefits"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Role-Based Flows",
      description: "Different signup experiences for guests vs. hosts with relevant preferences"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      title: "Quick Signup Option",
      description: "Express registration for users who want to get started immediately"
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Enhanced Security",
      description: "Real-time password validation with clear visual feedback"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      title: "Better UX",
      description: "Progressive disclosure, step indicators, and contextual help"
    }
  ];

  const demoScenarios = [
    {
      title: "Guest Registration",
      description: "Someone wanting to book accommodations",
      action: () => handleOpenModal('signup', 'user'),
      buttonText: "Sign Up as Guest",
      variant: "default" as const
    },
    {
      title: "Host Registration", 
      description: "Someone wanting to list their property",
      action: () => handleOpenModal('signup', 'owner'),
      buttonText: "Sign Up as Host",
      variant: "secondary" as const
    },
    {
      title: "Quick Registration",
      description: "Express signup with minimal fields",
      action: () => handleOpenModal('signup', 'user'),
      buttonText: "Quick Sign Up",
      variant: "outline" as const
    },
    {
      title: "Login Flow",
      description: "Returning user authentication",
      action: () => handleOpenModal('login'),
      buttonText: "Login Demo",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Authentication System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A flexible, user-friendly sign-up and login experience designed to increase 
            conversions and improve user satisfaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3 mb-3">
                {feature.icon}
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Scenarios */}
        <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Try Different Scenarios</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {demoScenarios.map((scenario, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                <Button 
                  variant={scenario.variant}
                  onClick={scenario.action}
                  className="w-full"
                >
                  {scenario.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Key Improvements */}
        <div className="bg-blue-50 p-8 rounded-lg border">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Improvements</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Reduced Cognitive Load</h4>
                <p className="text-gray-600 text-sm">Multi-step process prevents overwhelming users with too many fields at once</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Flexible Email Requirement</h4>
                <p className="text-gray-600 text-sm">Email is optional but benefits are clearly explained to encourage provision</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Contextual Preferences</h4>
                <p className="text-gray-600 text-sm">Different preference options shown based on user type (guest vs. host)</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Quick Signup Alternative</h4>
                <p className="text-gray-600 text-sm">Express option for users who want immediate access with minimal friction</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Enhanced Validation</h4>
                <p className="text-gray-600 text-sm">Real-time feedback with visual indicators for password requirements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Implementation</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Frontend Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Step-by-step form validation</li>
                <li>• Progressive disclosure of fields</li>
                <li>• Real-time password strength indicator</li>
                <li>• Responsive design for mobile</li>
                <li>• Accessibility considerations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Backend Integration:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Existing API compatibility</li>
                <li>• Flexible field requirements</li>
                <li>• Role-based user creation</li>
                <li>• Preference storage</li>
                <li>• Enhanced error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Enhanced Auth Modal */}
      <EnhancedAuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode={authMode}
        suggestedRole={suggestedRole}
      />
    </div>
  );
};

export default EnhancedAuthDemo;
