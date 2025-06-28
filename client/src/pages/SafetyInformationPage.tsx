
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SafetyInformationPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Safety Information</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Property Safety Features</h2>
              <p className="text-gray-700 mb-4">
                All our properties are equipped with essential safety features including smoke detectors, 
                fire extinguishers, and first aid kits. Emergency exits are clearly marked.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Guest Verification</h2>
              <p className="text-gray-700 mb-4">
                We verify all guests through government-issued ID and secure payment methods. 
                This helps ensure a safe environment for everyone in our community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Emergency Contacts</h2>
              <p className="text-gray-700 mb-4">
                In case of emergency, contact local authorities (Police: 19, Medical: 15, Fire: 15). 
                For non-emergency property issues, contact our 24/7 support line at +212 5XX XX XX XX.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Health & Hygiene</h2>
              <p className="text-gray-700 mb-4">
                All properties undergo thorough cleaning between stays following enhanced hygiene protocols. 
                We provide hand sanitizers and cleaning supplies for your convenience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Local Area Safety</h2>
              <p className="text-gray-700 mb-4">
                Martil is generally a safe destination. However, we recommend standard travel precautions: 
                don't leave valuables unattended, be aware of your surroundings, and follow local customs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Reporting Issues</h2>
              <p className="text-gray-700">
                If you encounter any safety concerns during your stay, please report them immediately to our support team at 
                <a href="mailto:safety@martilhaven.com" className="text-moroccan-blue hover:underline ml-1">
                  safety@martilhaven.com
                </a> or call our emergency hotline at +212 5XX XX XX XX.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SafetyInformationPage;
