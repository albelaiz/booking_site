
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at 
                <a href="mailto:info@martilhaven.com" className="text-moroccan-blue hover:underline ml-1">
                  info@martilhaven.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
