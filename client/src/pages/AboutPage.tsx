
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  // ========== EDITABLE CONTENT - MODIFY THESE VALUES ==========
  
  // Hero Section Content
  const heroContent = {
    backgroundImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1900&q=80",
    title: "About TamudaStay",
    subtitle: "Connecting travelers with exceptional vacation properties along stunning coastal destinations."
  };

  // Our Story Content
  const storyContent = {
    title: "Our Story",
    paragraphs: [
      "TamudaStay began with a simple vision: to showcase the beauty and charm of coastal destinations to travelers from around the world. Founded in 2020 by a group of coastal natives and travel enthusiasts, our mission is to provide visitors with authentic, high-quality accommodation experiences that highlight the unique character of beautiful waterfront locations.",
      "Each property in our collection is personally vetted by our team to ensure it meets our standards of quality, comfort, and authentic coastal hospitality. From luxurious beachfront villas to charming seaside cottages, our diverse portfolio offers something for every type of traveler.",
      "We believe that the right accommodation can transform a good vacation into an unforgettable one. That's why we work closely with property owners to maintain high standards and with guests to understand their needs and preferences. Our local knowledge and personalized service set us apart, helping travelers discover not just beautiful properties but the true essence of coastal living."
    ]
  };

  // Why Choose Us Features
  const whyChooseUsFeatures = [
    {
      title: "Curated Selection",
      description: "Every property is personally inspected and selected for its quality, location, and distinctive character."
    },
    {
      title: "Local Expertise", 
      description: "Our team of Martil natives provides insider knowledge and recommendations to enhance your stay."
    },
    {
      title: "Personalized Service",
      description: "From booking assistance to arranging special experiences, we're dedicated to making your stay perfect."
    }
  ];

  // Values Content
  const valuesContent = [
    {
      title: "Authenticity",
      description: "We showcase the true culture and beauty of Martil through our properties and experiences."
    },
    {
      title: "Excellence", 
      description: "We strive for the highest standards in every aspect of our service and property selection."
    },
    {
      title: "Community",
      description: "We support local businesses and artisans, fostering sustainable tourism that benefits Martil."
    },
    {
      title: "Integrity",
      description: "We operate with transparency, honesty, and fairness in all our dealings with guests and partners."
    }
  ];

  // ========== END EDITABLE CONTENT ==========

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative">
        {/* Much more subtle background that won't interfere with text */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-50/20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center bg-white">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroContent.backgroundImage} 
              alt="Martil Cityscape" 
              className="w-full h-full object-cover opacity-20" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/60"></div>
          </div>
          
          <div className="container-custom relative z-10 text-gray-900">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-gray-900">
              {heroContent.title}
            </h1>
            <p className="text-xl max-w-2xl text-gray-700">
              {heroContent.subtitle}
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 bg-white relative z-10">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="section-title mb-6">{storyContent.title}</h2>
              {storyContent.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 bg-blue-50 relative z-10">
          <div className="container-custom">
            <h2 className="section-title text-center mx-auto">Why Choose TamudaStay</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {whyChooseUsFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center border border-blue-100">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>}
                      {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>}
                      {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>}
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-blue-600 text-white relative z-10">
          <div className="container-custom">
            <h2 className="text-3xl font-serif font-medium mb-12 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuesContent.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>}
                      {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>}
                      {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>}
                      {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>}
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">{value.title}</h3>
                  <p className="text-blue-100 text-base leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
