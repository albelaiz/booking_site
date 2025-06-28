
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gray-100 py-12">
          <div className="container-custom">
            <h1 className="text-3xl font-serif font-medium mb-2">Contact Us</h1>
            <p className="text-gray-600">
              Have questions or need assistance? We're here to help.
            </p>
          </div>
        </section>
        
        {/* Contact Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-serif font-medium mb-6">Our Information</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visit Our Office</h3>
                    <address className="not-italic text-gray-600">
                      <p>Boulevard Mohammed V</p>
                      <p>BayHaven, Morocco</p>
                    </address>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Contact Details</h3>
                    <div className="text-gray-600">
                      <p>Email: info@bayhaven.com</p>
                      <p>Phone: +212 654698554</p>
                      <p>Fax: +212 654698554</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-10 h-80 bg-gray-200 rounded-lg overflow-hidden">
                  {/* In a real application, this would be a map */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-500">Map of BayHaven Office Location</div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-moroccan-white">
          <div className="container-custom">
            <h2 className="section-title text-center mx-auto">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto mt-10 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">How do I make a reservation?</h3>
                <p className="text-gray-600">
                  You can make a reservation by selecting a property and submitting a booking request through our website. Our team will contact you to confirm availability and process your booking.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">What is the cancellation policy?</h3>
                <p className="text-gray-600">
                  Cancellation policies vary by property. Generally, cancellations made at least 30 days before check-in receive a full refund. Please check the specific policy for your chosen property during the booking process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Do you offer airport transfers?</h3>
                <p className="text-gray-600">
                  Yes, we can arrange airport transfers from Tangier or Tetouan airports for an additional fee. Please let us know your flight details when booking.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Is there a security deposit?</h3>
                <p className="text-gray-600">
                  Most properties require a security deposit, which is refundable after check-out if no damages are found. The deposit amount varies by property.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
