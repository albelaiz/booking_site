import React, { useState } from 'react';
import { useToast } from "../hooks/use-toast";
import { useMessages } from '../contexts/MessagesContext';

const ContactForm = () => {
  const { addMessage } = useMessages();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add message to context
    addMessage({ name, email, subject, message });

    // Show success toast notification
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out! We'll get back to you shortly.",
    });

    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 form-container">
      <h2 className="text-2xl font-serif font-medium mb-6">Get in Touch</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-moroccan-blue form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-moroccan-blue form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-moroccan-blue form-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-moroccan-blue form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button 
            type="submit"
            className="bg-moroccan-blue hover:bg-moroccan-blue/90 text-white px-8 py-3 rounded-lg font-medium transition duration-200 touch-friendly contact-form"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;