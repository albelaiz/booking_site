import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Bot, User, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface HostChatbotProps {
  language?: 'en' | 'ar';
  position?: 'bottom-right' | 'bottom-left';
}

const TamudaHostChatbot: React.FC<HostChatbotProps> = ({ 
  language = 'en', 
  position = 'bottom-left' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessages = {
    en: "🏠 Welcome to TamudaStay Host Support! I'm here to help you succeed as a host in Morocco. Whether you're just starting out or looking to optimize your listings, I can assist with everything from pricing strategies to guest communication. What can I help you with today?",
    ar: "🏠 مرحباً بك في دعم مضيفي تاموداستاي! أنا هنا لمساعدتك على النجاح كمضيف في المغرب. سواء كنت بدأت للتو أو تتطلع لتحسين قوائمك، يمكنني المساعدة في كل شيء من استراتيجيات التسعير إلى التواصل مع الضيوف. بماذا يمكنني مساعدتك اليوم؟"
  };

  const placeholders = {
    en: "Ask about listing, pricing, guest management...",
    ar: "اسأل عن القوائم، التسعير، إدارة الضيوف..."
  };

  const quickSuggestions = {
    en: [
      "How do I create my first listing?",
      "What pricing strategy works best in Morocco?",
      "How to communicate with Arabic-speaking guests?",
      "What amenities do guests expect most?"
    ],
    ar: [
      "كيف أنشئ قائمتي الأولى؟",
      "ما هي استراتيجية التسعير الأفضل في المغرب؟",
      "كيف أتواصل مع الضيوف الناطقين بالإنجليزية؟",
      "ما هي المرافق التي يتوقعها الضيوف أكثر؟"
    ]
  };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: welcomeMessages[language],
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/host-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          context: 'TamudaStay Host Assistant - Helping property owners and hosts in Morocco'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Smart fallback responses for hosts
      const hostFallbackResponses = {
        en: "Thank you for your question! For detailed host support, please visit our Host Dashboard or contact our host support team directly. We're here to help you succeed as a TamudaStay host in Morocco! 📞 Host Support: +212 XXX-XXXXXX",
        ar: "شكراً لك على سؤالك! للحصول على دعم مفصل للمضيفين، يرجى زيارة لوحة تحكم المضيف أو الاتصال بفريق دعم المضيفين مباشرة. نحن هنا لمساعدتك على النجاح كمضيف في تاموداستاي في المغرب! 📞 دعم المضيفين: +212 XXX-XXXXXX"
      };

      return hostFallbackResponses[language];
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(suggestion);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <div 
        className={`fixed bottom-6 z-50 ${
          position === 'bottom-right' ? 'right-6' : 'left-6'
        }`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          data-host-chat-trigger="true"
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <Home className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {language === 'ar' ? 'مساعد المضيفين' : 'Host Assistant'}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 z-50 ${
        position === 'bottom-right' ? 'right-6' : 'left-6'
      }`}
    >
      <Card className="w-80 h-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              {language === 'ar' ? 'مساعد المضيفين' : 'Host Assistant'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-green-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <Home className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                      )}
                      {message.isUser && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-white" />
                      )}
                      <div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isUser ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Suggestion Buttons for Hosts */}
              {messages.length === 1 && !isLoading && (
                <div className="mt-4 space-y-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <p className="text-xs text-gray-500 px-2 font-medium">
                    {language === 'ar' ? 'أسئلة شائعة للمضيفين:' : 'Common host questions:'}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickSuggestions[language].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="text-left p-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors duration-200"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-green-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'ar' ? 'جاري التفكير...' : 'Thinking...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-3 border-t bg-gray-50/50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholders[language]}
                disabled={isLoading}
                className="flex-1 border-gray-200 focus:border-green-500"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TamudaHostChatbot;
