
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SitemapPage = () => {
  const siteLinks = [
    { title: 'Home', path: '/', description: 'Discover beautiful vacation properties in BayHaven' },
    { title: 'Properties', path: '/properties', description: 'Browse all available properties' },
    { title: 'About Us', path: '/about', description: 'Learn about BayHaven and our story' },
    { title: 'Contact', path: '/contact', description: 'Get in touch with our team' },
    { title: 'Become a Host', path: '/become-host', description: 'List your property with us' },
    { title: 'Owner Dashboard', path: '/owner-dashboard', description: 'Manage your properties' },
    { title: 'Privacy Policy', path: '/privacy-policy', description: 'Our privacy policy and data protection' },
    { title: 'Terms of Service', path: '/terms-of-service', description: 'Terms and conditions of use' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-serif font-medium mb-8">Sitemap</h1>
          <p className="text-gray-600 mb-12">
            Find all the pages and sections available on BayHaven website.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteLinks.map((link, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <Link 
                  to={link.path} 
                  className="text-xl font-serif text-moroccan-blue hover:text-moroccan-gold transition-colors"
                >
                  {link.title}
                </Link>
                <p className="text-gray-600 mt-2">{link.description}</p>
                <span className="text-sm text-gray-400 mt-2 block">{link.path}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SitemapPage;
