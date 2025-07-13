// TamudaStay Chatbot Context and Smart Responses
// This file contains context information and fallback responses for the AI chatbot

export interface ChatbotContext {
  businessName: string;
  location: string;
  services: string[];
  features: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

export const tamudaStayContext: ChatbotContext = {
  businessName: "TamudaStay",
  location: "Tamuda Bay, Martil, and Tetouan area in Northern Morocco",
  services: [
    "Luxury vacation rental properties",
    "Beachfront villas and apartments", 
    "Instant booking system",
    "24/7 guest support",
    "Property management for hosts",
    "Local tourism guidance"
  ],
  features: [
    "Ocean view properties",
    "Family-friendly accommodations",
    "Modern amenities",
    "Authentic Moroccan hospitality",
    "Close to beaches and attractions",
    "Flexible booking options"
  ],
  policies: {
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in"
  }
};

// Smart fallback responses when OpenAI API is not available
export const smartFallbackResponses = {
  en: {
    // Beach-related queries
    beach: [
      "🏖️ Great choice! We have stunning beachfront properties in Martil and Tamuda Bay. Our oceanfront villas offer direct beach access and breathtaking Mediterranean views. Would you like to see our featured beachfront properties?",
      "🌊 Our beachfront properties are just steps away from pristine sandy beaches! We have apartments and villas with ocean views in Martil, perfect for beach lovers. Check out our 'Featured Properties' section!"
    ],
    
    // Accommodation queries  
    apartments: [
      "🏠 Yes! We have beautiful apartments for groups of 4 in Martil and Tamuda Bay. Our 2-bedroom apartments feature modern amenities, kitchen facilities, and many have sea views. Would you like me to check availability for specific dates?",
      "✨ Perfect! Our family apartments accommodate 4 people comfortably. They include fully equipped kitchens, living areas, and are located close to beaches and local attractions."
    ],
    
    // Host-related queries
    host: [
      "🏡 Becoming a TamudaStay host is simple! Visit our 'Become a Host' page to start your journey. We provide full support including property photography, listing optimization, and guest management. Ready to earn from your property?",
      "💼 Join our host community! We handle everything from marketing your property to guest communications. Our hosts earn great income while we take care of the details. Click 'Become a Host' to get started!"
    ],
    
    // Check-in/policy queries
    checkin: [
      "🕐 Our standard check-in time is 3:00 PM and check-out is 11:00 AM. However, we're flexible and can often accommodate early check-in or late check-out based on availability. Just let us know your needs!",
      "⏰ Check-in: 3:00 PM | Check-out: 11:00 AM. We also offer luggage storage if you arrive early or need to leave bags after checkout. Contact us for special timing requests!"
    ],
    
    // Location queries
    location: [
      "📍 We're located in beautiful Northern Morocco! Our properties span Tamuda Bay, Martil, and the historic Tetouan area. You'll enjoy pristine beaches, rich culture, and are just minutes from Spain's coast across the Mediterranean!",
      "🗺️ Our prime locations include: Tamuda Bay (luxury beachfront), Martil (vibrant beach town), and Tetouan (UNESCO World Heritage medina). Each offers unique charm and easy access to beaches and attractions!"
    ],
    
    // General/default responses
    default: [
      "👋 Welcome to TamudaStay! I'm here to help you find the perfect vacation rental in Morocco's stunning northern coast. Whether you're looking for beachfront villas, family apartments, or cultural experiences, we've got you covered!",
      "🌟 Thanks for choosing TamudaStay! We specialize in luxury vacation rentals in Tamuda Bay, Martil, and Tetouan. How can I help make your Moroccan getaway unforgettable?",
      "💫 Hello! I'm your TamudaStay assistant. Need help finding the perfect property, learning about our locations, or have questions about booking? I'm here to help!"
    ]
  },
  
  ar: {
    beach: [
      "🏖️ اختيار رائع! لدينا عقارات مذهلة على الشاطئ في مارتيل وخليج تامودا. فيلاتنا المطلة على المحيط توفر وصولاً مباشراً للشاطئ ومناظر خلابة للبحر الأبيض المتوسط. هل تريد رؤية عقاراتنا المميزة على الشاطئ؟",
      "🌊 عقاراتنا على الشاطئ على بُعد خطوات فقط من الشواطئ الرملية الجميلة! لدينا شقق وفيلات بإطلالة على المحيط في مارتيل، مثالية لعشاق الشاطئ. تحقق من قسم 'العقارات المميزة'!"
    ],
    
    apartments: [
      "🏠 نعم! لدينا شقق جميلة لمجموعات من 4 أشخاص في مارتيل وخليج تامودا. شققنا ذات الغرفتين تتميز بوسائل الراحة الحديثة ومرافق المطبخ والكثير منها يطل على البحر. هل تريد مني التحقق من التوفر لتواريخ محددة؟",
      "✨ مثالي! شققنا العائلية تستوعب 4 أشخاص براحة. تشمل مطابخ مجهزة بالكامل ومناطق معيشة وتقع بالقرب من الشواطئ والمعالم المحلية."
    ],
    
    host: [
      "🏡 أن تصبح مضيفاً في تاموداستاي أمر بسيط! قم بزيارة صفحة 'كن مضيفاً' لبدء رحلتك. نحن نوفر الدعم الكامل بما في ذلك تصوير العقار وتحسين القائمة وإدارة الضيوف. مستعد للكسب من عقارك؟",
      "💼 انضم إلى مجتمع المضيفين لدينا! نحن نتولى كل شيء من تسويق عقارك إلى التواصل مع الضيوف. مضيفونا يحصلون على دخل رائع بينما نحن نتولى التفاصيل. انقر على 'كن مضيفاً' للبدء!"
    ],
    
    checkin: [
      "🕐 وقت تسجيل الوصول المعياري هو 3:00 مساءً ووقت المغادرة هو 11:00 صباحاً. ومع ذلك، نحن مرنون ويمكننا غالباً استيعاب الوصول المبكر أو المغادرة المتأخرة بناءً على التوفر. فقط أخبرنا باحتياجاتك!",
      "⏰ تسجيل الوصول: 3:00 مساءً | المغادرة: 11:00 صباحاً. نحن نوفر أيضاً تخزين الأمتعة إذا وصلت مبكراً أو تحتاج لترك الحقائب بعد المغادرة. اتصل بنا لطلبات التوقيت الخاصة!"
    ],
    
    location: [
      "📍 نحن في شمال المغرب الجميل! عقاراتنا تمتد عبر خليج تامودا ومارتيل ومنطقة تطوان التاريخية. ستستمتع بالشواطئ النقية والثقافة الغنية وتبعد دقائق فقط عن ساحل إسبانيا عبر البحر الأبيض المتوسط!",
      "🗺️ مواقعنا الرئيسية تشمل: خليج تامودا (الواجهة البحرية الفاخرة)، مارتيل (مدينة شاطئية نابضة بالحياة)، وتطوان (مدينة التراث العالمي لليونسكو). كل منها يوفر سحراً فريداً ووصولاً سهلاً للشواطئ والمعالم!"
    ],
    
    default: [
      "👋 مرحباً بك في تاموداستاي! أنا هنا لمساعدتك في العثور على الإيجار المثالي للعطلات في الساحل الشمالي المذهل للمغرب. سواء كنت تبحث عن فيلات على الشاطئ أو شقق عائلية أو تجارب ثقافية، لدينا ما يناسبك!",
      "🌟 شكراً لاختيارك تاموداستاي! نحن متخصصون في إيجارات العطل الفاخرة في خليج تامودا ومارتيل وتطوان. كيف يمكنني مساعدتك في جعل عطلتك المغربية لا تُنسى؟",
      "💫 مرحباً! أنا مساعدك في تاموداستاي. تحتاج مساعدة في العثور على العقار المثالي أو التعرف على مواقعنا أو لديك أسئلة حول الحجز؟ أنا هنا للمساعدة!"
    ]
  }
};

// Function to get smart response based on message content
export function getSmartFallbackResponse(message: string, language: 'en' | 'ar'): string {
  const messageLC = message.toLowerCase();
  const responses = smartFallbackResponses[language];
  
  // Determine response category based on keywords
  if (messageLC.includes('beach') || messageLC.includes('شاطئ') || messageLC.includes('ocean') || messageLC.includes('محيط')) {
    const beachResponses = responses.beach;
    return beachResponses[Math.floor(Math.random() * beachResponses.length)];
  }
  
  if (messageLC.includes('apartment') || messageLC.includes('شقة') || messageLC.includes('people') || messageLC.includes('أشخاص') || 
      messageLC.includes('family') || messageLC.includes('عائلة')) {
    const apartmentResponses = responses.apartments;
    return apartmentResponses[Math.floor(Math.random() * apartmentResponses.length)];
  }
  
  if (messageLC.includes('host') || messageLC.includes('مضيف') || messageLC.includes('become') || messageLC.includes('أصبح')) {
    const hostResponses = responses.host;
    return hostResponses[Math.floor(Math.random() * hostResponses.length)];
  }
  
  if (messageLC.includes('check') || messageLC.includes('وصول') || messageLC.includes('time') || messageLC.includes('وقت')) {
    const checkinResponses = responses.checkin;
    return checkinResponses[Math.floor(Math.random() * checkinResponses.length)];
  }
  
  if (messageLC.includes('location') || messageLC.includes('موقع') || messageLC.includes('where') || messageLC.includes('أين')) {
    const locationResponses = responses.location;
    return locationResponses[Math.floor(Math.random() * locationResponses.length)];
  }
  
  // Default response
  const defaultResponses = responses.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Enhanced system prompt for OpenAI
export function createSystemPrompt(language: 'en' | 'ar'): string {
  const context = tamudaStayContext;
  
  if (language === 'ar') {
    return `أنت مساعد ذكي ومفيد لموقع ${context.businessName}، وهو موقع لحجز العطل الشاطئية الفاخرة في المغرب.

معلومات الشركة:
📍 الموقع: ${context.location}
🏖️ نحن متخصصون في العقارات الشاطئية الفاخرة والفيلات والشقق
⭐ نوفر حجوزات فورية وتجربة ضيافة مغربية أصيلة

سياساتنا:
• تسجيل الوصول: ${context.policies.checkIn}
• المغادرة: ${context.policies.checkOut}  
• الإلغاء: ${context.policies.cancellation}

خدماتنا تشمل:
${context.services.map(service => `• ${service}`).join('\n')}

مميزاتنا:
${context.features.map(feature => `• ${feature}`).join('\n')}

كن مفيداً ومهذباً ومتحمساً. استخدم الرموز التعبيرية بشكل مناسب. قدم معلومات مفيدة عن عقاراتنا والمنطقة المحلية. إذا سُئلت عن شيء لا تعرفه، اقترح الاتصال بفريق الدعم.`;
  }
  
  return `You are a helpful and knowledgeable AI assistant for ${context.businessName}, a luxury vacation rental booking website specializing in beautiful coastal properties in Morocco.

Company Information:
📍 Location: ${context.location}
🏖️ We specialize in luxury beachfront properties, villas, and apartments
⭐ We offer instant booking and authentic Moroccan hospitality

Our Policies:
• Check-in: ${context.policies.checkIn}
• Check-out: ${context.policies.checkOut}
• Cancellation: ${context.policies.cancellation}

Our Services:
${context.services.map(service => `• ${service}`).join('\n')}

Our Features:
${context.features.map(feature => `• ${feature}`).join('\n')}

Be helpful, polite, and enthusiastic. Use appropriate emojis. Provide useful information about our properties and the local area. If asked about something you don't know, suggest contacting our support team.`;
}
