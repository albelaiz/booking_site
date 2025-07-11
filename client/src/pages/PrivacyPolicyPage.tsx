
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelSearchBar from '../components/HotelSearchBar';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hotel Search Bar */}
      <div className="bg-gray-50 py-8">
        <div className="container-custom max-w-6xl">
          <HotelSearchBar 
            onSearch={(searchData) => {
              console.log('Search data:', searchData);
              // Handle search logic here
            }}
          />
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: {new Date().getFullYear()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a reservation, or contact us for support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              
              <div className="space-y-3">
                {/* Email Contact */}
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-5 h-5 text-moroccan-blue" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span className="text-gray-700">Email:</span>
                  <a href="mailto:tamudastay@gmail.com" className="text-moroccan-blue hover:underline">
                    tamudastay@gmail.com
                  </a>
                </div>
                
                {/* WhatsApp Contact */}
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-5 h-5 text-green-600" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.085"/>
                  </svg>
                  <span className="text-gray-700">WhatsApp:</span>
                  <a 
                    href="https://wa.me/212654698554" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 hover:underline font-medium"
                  >
                    +212 654 698 554
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
