
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CancellationOptionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Cancellation Options</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Flexible Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancel up to 24 hours before check-in for a full refund, minus service fees. 
                This policy applies to most of our properties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Moderate Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancel up to 5 days before check-in for a full refund. Cancellations within 5 days 
                receive a 50% refund. Service fees are non-refundable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Strict Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancel up to 30 days before check-in for a full refund. Cancellations within 30 days 
                receive a 50% refund. No refund for cancellations within 14 days of check-in.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Extenuating Circumstances</h2>
              <p className="text-gray-700 mb-4">
                We understand that sometimes unexpected events occur. In cases of documented emergencies, 
                natural disasters, or other extenuating circumstances, we may waive our standard cancellation policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">How to Cancel</h2>
              <p className="text-gray-700 mb-4">
                To cancel your reservation, log into your account, go to your bookings, and select "Cancel Reservation". 
                You can also contact our support team for assistance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Refund Processing</h2>
              <p className="text-gray-700">
                Refunds are typically processed within 5-10 business days to your original payment method. 
                For questions about your refund, contact us at 
                <a href="mailto:refunds@martilhaven.com" className="text-moroccan-blue hover:underline ml-1">
                  refunds@martilhaven.com
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

export default CancellationOptionsPage;
