
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  Award, 
  Handshake, 
  Home,
  Camera,
  Calendar,
  Star,
  Shield,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import EnhancedAuthModal from '../components/EnhancedAuthModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const BecomeHostPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If user is logged in, check their role
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'owner' || userRole === 'admin') {
        navigate('/owner-dashboard');
      } else {
        // If user is guest/customer, upgrade them to owner and redirect
        localStorage.setItem('userRole', 'owner');
        alert('Welcome to hosting! You can now create and manage property listings. Redirecting to your owner dashboard.');
        navigate('/owner-dashboard');
      }
    } else {
      // If not logged in, show auth modal for signup/login
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    
    // After successful auth, upgrade user to owner role if they're not already
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
      // Upgrade user to owner role since they're registering to become a host
      localStorage.setItem('userRole', 'owner');
    }
    
    // Redirect to owner dashboard
    navigate('/owner-dashboard');
  };

  const handleLearnMore = () => {
    // Scroll to FAQ section
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          
          <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-20">
            <div className="inline-flex items-center px-4 py-2 bg-moroccan-gold/20 backdrop-blur-sm rounded-full text-moroccan-gold text-sm font-medium mb-6 animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              #1 Coastal Rental Platform in Morocco
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-fade-in">
              Turn your property into
              <span className="block text-moroccan-gold">extraordinary income</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in animate-delay-200">
              Join thousands of successful hosts earning up to <strong className="text-moroccan-gold">$3,500/month</strong> 
              sharing their beautiful coastal properties
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in animate-delay-300">
              <Button 
                size="lg" 
                className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-black text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                onClick={handleGetStarted}
              >
                <Home className="w-5 h-5 mr-2" />
                List Your Place
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-moroccan-blue text-lg px-8 py-4 rounded-xl font-semibold min-w-[200px] transition-all duration-300"
                onClick={handleLearnMore}
              >
                Learn How It Works
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in animate-delay-500">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-moroccan-gold mb-2">50K+</div>
                <div className="text-sm opacity-90">Happy Guests</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-moroccan-gold mb-2">$2.8M+</div>
                <div className="text-sm opacity-90">Host Earnings</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-moroccan-gold mb-2">4.9★</div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
                List your place in 3 easy steps
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start earning money from your property in just a few clicks. Our streamlined process gets you hosting in no time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="w-16 h-16 bg-moroccan-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                    <Camera className="w-8 h-8 text-moroccan-blue" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Share your space</h3>
                  <p className="text-gray-600 mb-6">
                    Add photos, description, and amenities of your property. Show guests what makes your place special.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      High-quality photo tips
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Professional descriptions
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Amenity optimization
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="w-16 h-16 bg-moroccan-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                    <Calendar className="w-8 h-8 text-moroccan-blue" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Set your terms</h3>
                  <p className="text-gray-600 mb-6">
                    Choose your availability, set competitive pricing, and establish house rules that work for you.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Smart pricing suggestions
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Flexible scheduling
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Custom house rules
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="w-16 h-16 bg-moroccan-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                    <TrendingUp className="w-8 h-8 text-moroccan-blue" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900">Start earning</h3>
                  <p className="text-gray-600 mb-6">
                    Get bookings, welcome guests, and start earning. We handle payments and provide 24/7 support.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Instant notifications
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Secure payments
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      24/7 host support
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-moroccan-blue hover:bg-moroccan-blue/90 text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleGetStarted}
              >
                <Home className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Free to list • No upfront costs • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-moroccan-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
                Why thousands choose BayHaven
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join the most trusted hosting platform in Morocco with industry-leading support and earning potential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-moroccan-blue to-moroccan-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900">Maximum earnings</h3>
                <p className="text-gray-600 mb-4">
                  Earn up to 40% more than competitors. Our smart pricing and marketing tools maximize your revenue.
                </p>
                <div className="text-2xl font-bold text-moroccan-gold">$3,500</div>
                <div className="text-sm text-gray-500">avg. monthly income</div>
              </div>

              {/* Feature 2 */}
              <div className="text-center group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-moroccan-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900">Complete protection</h3>
                <p className="text-gray-600 mb-4">
                  $1M host protection insurance, secure payments, and verified guests for total peace of mind.
                </p>
                <div className="text-2xl font-bold text-moroccan-blue">$1M</div>
                <div className="text-sm text-gray-500">protection coverage</div>
              </div>

              {/* Feature 3 */}
              <div className="text-center group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900">Your schedule</h3>
                <p className="text-gray-600 mb-4">
                  Complete control over when and how you host. Block dates, set rules, and host on your terms.
                </p>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500">flexible hosting</div>
              </div>

              {/* Feature 4 */}
              <div className="text-center group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900">Expert support</h3>
                <p className="text-gray-600 mb-4">
                  24/7 multilingual support, hosting tips, and a dedicated success manager for top hosts.
                </p>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-500">expert support</div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="mt-16 bg-gradient-to-r from-moroccan-blue to-moroccan-blue/90 rounded-3xl p-8 md:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                    Plus exclusive host benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Professional photography</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Marketing optimization</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Revenue analytics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Co-host network</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Tax consultation</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-moroccan-gold mr-3 flex-shrink-0" />
                      <span>Exclusive events</span>
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-moroccan-gold mb-2">92%</div>
                    <div className="text-lg">Host satisfaction rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Story Section */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-moroccan-gold/20 rounded-full"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-moroccan-blue/10 rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Successful host Amina"
                  className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-moroccan-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Amina K.</h4>
                      <p className="text-sm text-gray-600">Superhost • Martil</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">4.9 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Success Story
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                  "Hosting transformed my <span className="text-moroccan-gold">riad into a goldmine</span>"
                </h2>
                
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    "I was skeptical about hosting at first, but after just one month on BayHaven, 
                    I earned enough to renovate my entire kitchen! The guests absolutely love experiencing 
                    authentic Moroccan hospitality."
                  </p>
                  <p>
                    "What surprised me most was how BayHaven's support team helped me optimize my listing. 
                    My bookings increased by 300% after following their photography and pricing tips."
                  </p>
                  <p className="font-semibold text-moroccan-blue">
                    "Now I'm earning $4,200/month consistently, and I've met incredible people from 
                    around the world. It's not just income—it's become my passion."
                  </p>
                </div>
                
                <div className="bg-moroccan-blue/5 border border-moroccan-blue/20 rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-moroccan-blue">$4,200</div>
                      <div className="text-sm text-gray-600">Monthly income</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-moroccan-blue">127</div>
                      <div className="text-sm text-gray-600">Happy guests</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-moroccan-blue">98%</div>
                      <div className="text-sm text-gray-600">Occupancy rate</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-black text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleGetStarted}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Start Your Success Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-20 bg-white">
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
                onClick={handleGetStarted}
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-moroccan-blue hover:bg-white hover:text-moroccan-blue text-lg px-8 py-4 rounded-xl"
                onClick={handleLearnMore}
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
      
      {/* Enhanced Auth Modal for Signup/Login */}
      <EnhancedAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
        defaultMode="signup"
        suggestedRole="owner"
      />
    </div>
  );
};

export default BecomeHostPage;
