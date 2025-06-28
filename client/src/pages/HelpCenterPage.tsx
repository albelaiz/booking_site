
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Help Center</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-4">
                Welcome to MartilHaven! Here you'll find answers to common questions and helpful guides 
                to make the most of your experience with us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Booking a Property</h2>
              <p className="text-gray-700 mb-4">
                To book a property, browse our available listings, select your desired dates, 
                and submit a booking request. Our team will confirm availability and guide you through the process.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Payment & Pricing</h2>
              <p className="text-gray-700 mb-4">
                We accept various payment methods including credit cards and bank transfers. 
                All prices are displayed in local currency and include applicable taxes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Property Guidelines</h2>
              <p className="text-gray-700 mb-4">
                Please respect our properties and follow house rules. This includes no smoking, 
                no pets (unless specified), and maintaining cleanliness during your stay.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Contact Support</h2>
              <p className="text-gray-700">
                Need additional help? Contact our support team at 
                <a href="mailto:support@martilhaven.com" className="text-moroccan-blue hover:underline ml-1">
                  support@martilhaven.com
                </a> or call us at +212 5XX XX XX XX
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
