import React from 'react';
import TamudaChatbot from './Chatbot';

const SimpleTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          TamudaStay Chatbot Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Chatbot Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ AI-powered responses using OpenAI GPT</li>
            <li>✅ Support for English and Arabic languages</li>
            <li>✅ Contextual knowledge about TamudaStay properties</li>
            <li>✅ Beautiful floating chat interface</li>
            <li>✅ Loading animations and message history</li>
            <li>✅ Responsive design for all devices</li>
            <li>🆕 <strong>Quick suggestion buttons for common questions</strong></li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Try asking the chatbot:
          </h3>
          <div className="bg-blue-100 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm font-medium">
              💡 <strong>New Feature:</strong> Click the blue chat button and you'll see quick suggestion buttons 
              after the welcome message! Just click any suggestion to start the conversation instantly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-blue-800">English Questions:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• "Which properties are near the beach?"</li>
                <li>• "Do you have apartments for 4 people?"</li>
                <li>• "How can I become a host?"</li>
                <li>• "What are check-in times?"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-blue-800">Arabic Questions:</p>
              <ul className="space-y-1 text-blue-700" dir="rtl">
                <li>• "أي عقارات قريبة من الشاطئ؟"</li>
                <li>• "هل لديكم شقق لـ 4 أشخاص؟"</li>
                <li>• "كيف يمكنني أن أصبح مضيفاً؟"</li>
                <li>• "ما هي أوقات تسجيل الوصول؟"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Environment Setup
          </h3>
          <p className="text-green-800 text-sm">
            To use the full AI functionality, make sure to set your OPENAI_API_KEY 
            environment variable. Without it, the chatbot will use smart fallback responses.
          </p>
          <code className="block mt-2 p-2 bg-green-100 rounded text-green-800 text-xs">
            export OPENAI_API_KEY="your_openai_api_key_here"
          </code>
        </div>
      </div>

      {/* Chatbot Component - English */}
      <TamudaChatbot language="en" position="bottom-right" />
    </div>
  );
};

export default SimpleTest;