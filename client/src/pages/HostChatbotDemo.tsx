import React from 'react';
import TamudaHostChatbot from '../components/HostChatbot';

const HostChatbotDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-4">
            🏠 TamudaStay Host Assistant Demo
          </h1>
          <p className="text-lg text-green-700">
            Your AI-powered companion for hosting success in Morocco
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Host Assistant Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">🚀 Getting Started</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Listing setup guidance</li>
                <li>• Photo and description tips</li>
                <li>• Pricing strategies for Morocco</li>
                <li>• Legal requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">🏨 Property Management</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Guest communication</li>
                <li>• Check-in/out procedures</li>
                <li>• Maintenance scheduling</li>
                <li>• Emergency protocols</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">📈 Marketing & Optimization</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• SEO-friendly descriptions</li>
                <li>• Amenity recommendations</li>
                <li>• Local attraction guides</li>
                <li>• Seasonal strategies</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">💰 Financial Management</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Revenue optimization</li>
                <li>• Tax considerations</li>
                <li>• Expense tracking</li>
                <li>• Payout management</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-green-900 mb-3">
            🎯 Try these host-specific questions:
          </h3>
          <div className="bg-green-100 rounded-lg p-3 mb-4">
            <p className="text-green-800 text-sm font-medium">
              💡 <strong>Quick Tips:</strong> Click the green house icon (bottom-left) to start chatting with your Host Assistant. 
              The chatbot provides specialized guidance for property owners and hosts in Morocco!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-800 mb-2">🇺🇸 English Questions:</p>
                <ul className="space-y-1 text-green-700 bg-white p-3 rounded">
                  <li>• "How do I create my first listing?"</li>
                  <li>• "What pricing strategy works best in Morocco?"</li>
                  <li>• "How to communicate with Arabic-speaking guests?"</li>
                  <li>• "What amenities do guests expect most?"</li>
                  <li>• "How do I handle emergency situations?"</li>
                  <li>• "Best practices for Martil/Tamuda Bay properties?"</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-800 mb-2">🇲🇦 Arabic Questions:</p>
                <ul className="space-y-1 text-green-700 bg-white p-3 rounded" dir="rtl">
                  <li>• "كيف أنشئ قائمتي الأولى؟"</li>
                  <li>• "ما هي استراتيجية التسعير الأفضل في المغرب؟"</li>
                  <li>• "كيف أتواصل مع الضيوف الناطقين بالإنجليزية؟"</li>
                  <li>• "ما هي المرافق التي يتوقعها الضيوف أكثر؟"</li>
                  <li>• "كيف أتعامل مع حالات الطوارئ؟"</li>
                  <li>• "أفضل الممارسات لعقارات مارتيل/خليج تامودا؟"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-green-500 p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            🌟 Specialized Knowledge Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-2">🏖️ Local Expertise</h4>
              <p className="text-green-700">Guidance specific to Martil, Tamuda Bay, Tetouan, Chefchaouen, and Cabo Negro markets.</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-2">🤝 Cultural Sensitivity</h4>
              <p className="text-green-700">Tips for authentic Moroccan hospitality and cross-cultural guest relations.</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-2">📊 Market Insights</h4>
              <p className="text-green-700">Seasonal trends, pricing strategies, and competitive analysis for Morocco.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">
            🚀 Ready to Optimize Your Hosting Success?
          </h3>
          <p className="mb-4">
            Your TamudaStay Host Assistant is always available to help you maximize your property's potential, 
            improve guest satisfaction, and increase your earnings in Morocco's growing vacation rental market.
          </p>
          <div className="flex items-center space-x-2 text-green-100">
            <span>💬</span>
            <span>Click the green house icon to start your conversation!</span>
          </div>
        </div>
      </div>

      {/* Host Chatbot - English version */}
      <TamudaHostChatbot language="en" position="bottom-left" />
    </div>
  );
};

export default HostChatbotDemo;
