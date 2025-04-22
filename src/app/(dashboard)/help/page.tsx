"use client";

import React, { useState } from 'react';
import { Search, HelpCircle, MessageCircle, Mail, FileText, ChevronDown } from 'lucide-react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "How do I track my workouts?",
      answer: "To track a workout, go to the Workouts page, select a workout program, and click 'Start Workout'. Follow the guided instructions and mark exercises as complete. Your progress will be saved automatically."
    },
    {
      question: "Can I create custom workout plans?",
      answer: "Yes! To create a custom workout plan, navigate to the Workouts page and click the 'New Workout' button. You can then add exercises, set repetitions, rest periods, and save your custom plan."
    },
    {
      question: "How do I update my fitness goals?",
      answer: "You can update your fitness goals by going to Settings -> Account, and scrolling down to the 'Fitness Goals' section. Select your new goals and click 'Save Changes'."
    },
    {
      question: "Is there a way to track my nutrition?",
      answer: "Yes, ForgeFit offers nutrition tracking. Visit the Nutrition page to log your meals, track calories, and monitor your macronutrient intake. You can also use the food search to quickly find nutritional information."
    },
    {
      question: "How can I connect with other users?",
      answer: "Currently, the social features are under development. In future updates, you'll be able to connect with friends, join challenges, and share your progress."
    }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions or contact our support team.</p>
      </div>
      
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for help..."
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* FAQs */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left font-medium"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {openFaq === index && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contact options */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Support</h2>
            
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <MessageCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-gray-500">Chat with our support team</p>
                </div>
              </a>
              
              <a
                href="mailto:support@forgefit.com"
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-gray-500">support@forgefit.com</p>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Documentation</h3>
                  <p className="text-sm text-gray-500">Browse our user guides</p>
                </div>
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center">
                <HelpCircle size={20} className="text-blue-600 mr-2" />
                <h3 className="font-medium">Still need help?</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Our support team is available Monday to Friday, 9am to 5pm EST.
              </p>
              <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Submit a Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 