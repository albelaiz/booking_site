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
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-serif font-medium mb-6">Get in Touch</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button 
            type="submit"
            className="bg-moroccan-blue hover:bg-moroccan-blue/90 text-white px-8 py-3 rounded font-medium transition duration-200"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;