
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Award, Handshake } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const BecomeHostPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in">
              You could earn
            </h1>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-moroccan-gold animate-fade-in animate-delay-200">
              $2,500 a month
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in animate-delay-300">
              hosting your coastal property
            </p>
            <Button 
              size="lg" 
              className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-black text-lg px-8 py-4 rounded-xl animate-fade-in animate-delay-300"
            >
              Try Hosting
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <h2 className="section-title text-center mx-auto mb-16">
              Why host with BayHaven?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-moroccan-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                  <DollarSign className="w-8 h-8 text-moroccan-blue" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Earn extra income</h3>
                <p className="text-gray-600">
                  Turn your space into a source of income. Hosts in coastal areas earn an average of $2,500 per month.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-moroccan-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                  <Users className="w-8 h-8 text-moroccan-blue" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Meet new people</h3>
                <p className="text-gray-600">
                  Connect with travelers from around the world and share your love for coastal culture.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-moroccan-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                  <Award className="w-8 h-8 text-moroccan-blue" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">You're in control</h3>
                <p className="text-gray-600">
                  Set your own schedule, prices, and house rules. Host when and how you want.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-moroccan-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                  <Handshake className="w-8 h-8 text-moroccan-blue" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">We've got your back</h3>
                <p className="text-gray-600">
                  24/7 support, host protection insurance, and secure payment processing for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Story Section */}
        <section className="py-20 bg-moroccan-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Successful host"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
                  "Hosting has changed my life"
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  "I started hosting my traditional riad in Martil two years ago, and it's been an incredible journey. 
                  Not only have I been able to earn extra income to renovate my home, but I've met amazing people 
                  from all over the world who have become lifelong friends."
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  "The guests love experiencing authentic Moroccan hospitality, and I love sharing my culture and 
                  the hidden gems of Martil with them. It's been a win-win situation."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-moroccan-blue rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Amina</h4>
                    <p className="text-gray-600">Host since 2022 • Martil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="section-title text-center mx-auto mb-16">
              Frequently asked questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  How much can I earn hosting my property?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6">
                  Your earnings depend on your location, property type, and how often you host. In Martil, 
                  hosts typically earn between $1,500-$3,500 per month during peak season. You can use our 
                  earnings calculator to get a personalized estimate for your space.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  What requirements must my property meet?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6">
                  Your property should be clean, safe, and accurately represented in photos. Basic amenities 
                  like clean linens, towels, and essential toiletries should be provided. We'll help you 
                  optimize your listing to attract more guests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  How does Martil Haven protect me as a host?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6">
                  We provide Host Protection Insurance covering up to $1M in damages, 24/7 customer support, 
                  secure payment processing, and guest verification. We also have a review system that helps 
                  you make informed decisions about potential guests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  How do I get started?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6">
                  Getting started is easy! Click "Try Hosting" to create your listing, add photos and 
                  description of your space, set your availability and pricing, and publish your listing. 
                  Our team will review and approve your listing within 24 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  Can I host if I don't live in Martil full-time?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6">
                  Yes! Many successful hosts manage their properties remotely. You can arrange for local 
                  cleaning services, key exchanges, and property management. We can also connect you with 
                  trusted local co-hosts who can help manage your property when you're away.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-moroccan-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Ready to start hosting?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of hosts in Morocco who are earning extra income and sharing their culture 
              with travelers from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-black text-lg px-8 py-4 rounded-xl"
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-moroccan-blue text-lg px-8 py-4 rounded-xl"
              >
                Learn More
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Have questions? <Link to="/contact" className="underline hover:no-underline">Contact our support team</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeHostPage;
