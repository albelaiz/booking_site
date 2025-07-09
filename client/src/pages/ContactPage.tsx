
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative">
        {/* Much more subtle background that won't interfere with text */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-blue-50/10"></div>
        <div className="absolute top-32 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-blob"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-blob animation-delay-2000"></div>
        {/* Page Header */}
        <section className="bg-blue-50 py-12 relative z-10">
          <div className="container-custom">
            <h1 className="text-3xl font-serif font-medium mb-2 text-gray-900">Contact Us</h1>
            <p className="text-gray-700 text-lg">
              Have questions or need assistance? We're here to help.
            </p>
          </div>
        </section>
        
        {/* Contact Content */}
        <section className="py-16 bg-white relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-serif font-medium mb-6 text-gray-900">Our Information</h2>
                
                <div className="space-y-8">
                  {/* <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Visit Our Office</h3>
                    <address className="not-italic text-gray-700 text-base leading-relaxed">
                      <p>Boulevard Mohammed V</p>
                      <p>TamudaStay, Morocco</p>
                    </address>
                  </div> */}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Contact Details</h3>
                    <div className="text-gray-700 text-base leading-relaxed">
                      <p>Email: tamudastay@gmail.com</p>
                      <p>Phone: +212 654698554</p>
                      <p>Phone: +212 617658218</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Business Hours</h3>
                    <div className="text-gray-700 text-base leading-relaxed">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 9:00 AM - 6:00 PM</p>
                    </div>
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
        <section className="py-16 bg-blue-50 relative z-10">
          <div className="container-custom">
            <h2 className="section-title text-center mx-auto">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto mt-10 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">How do I make a reservation?</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  You can make a reservation by selecting a property and submitting a booking request through our website. Our team will contact you to confirm availability and process your booking.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">What is the cancellation policy?</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Cancellation policies vary by property. Generally, cancellations made at least 30 days before check-in receive a full refund. Please check the specific policy for your chosen property during the booking process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">Do you offer airport transfers?</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Yes, we can arrange airport transfers from Tangier or Tetouan airports for an additional fee. Please let us know your flight details when booking.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">Is there a security deposit?</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Most properties require a security deposit, which is refundable after check-out if no damages are found. The deposit amount varies by property.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton 
        phoneNumber="212654698554"
        message="Hello! I have a question about TamudaStay. Can you help me?"
        position="bottom-right"
      />
    </div>
  );
};

export default ContactPage;
