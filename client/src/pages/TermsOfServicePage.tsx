
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: {new Date().getFullYear()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using MartilHaven, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use MartilHaven for personal, non-commercial 
                transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Booking and Cancellation</h2>
              <p className="text-gray-700 mb-4">
                All bookings are subject to availability and confirmation. Cancellation policies 
                vary by property and will be clearly stated before booking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Liability</h2>
              <p className="text-gray-700 mb-4">
                MartilHaven shall not be liable for any damages arising from the use of this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Contact Information</h2>
              <p className="text-gray-700">
                For questions regarding these terms, please contact us at 
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

export default TermsOfServicePage;
