import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, User, MessageSquare, Users } from 'lucide-react';
import userAxiosInstance from '../../axios/userAxiosInstance';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import API_URL from '../../axios/API_URL';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please fill the name field";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please fill the phone field";
    } else if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please fill the message field";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userAxiosInstance.post(`${API_URL}/user/contact/${userInfo?.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('Message sent successfully:', response.data);

      setIsSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "Emergency: +1 (555) 911-HELP"],
      color: "bg-blue-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["appointments@WeCare.com", "emergency@WeCare.com"],
      color: "bg-green-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["123 Medical Center Drive", "Suite 100, Health City, HC 12345"],
      color: "bg-purple-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Support",
      details: ["24/7 Patient Support", "Multilingual Assistance Available"],
      color: "bg-orange-500"
    }
  ];

  const subjectOptions = [
    "General Inquiry",
    "Appointment Booking",
    "Medical Records",
    "Insurance Questions",
    "Emergency",
    "Feedback",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className=" text-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">Contact Us</h1>
          <p className="text-xl opacity-90 animate-fade-in-delay">
            We're here to help with all your healthcare needs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
                Get in Touch
              </h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className={`${item.color} text-white p-3 rounded-full flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                      {item.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600 mt-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <User className="w-8 h-8 mr-3 text-purple-600" />
              Send us a Message
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <div className="mt-1 text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="mt-1 text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <div className="mt-1 text-red-500 text-sm">{errors.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <div className="mt-1 text-red-500 text-sm">{errors.subject}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Please describe your inquiry or concern..."
                  />
                  {errors.message && (
                    <div className="mt-1 text-red-500 text-sm">{errors.message}</div>
                  )}
                </div>

                <div
                  onClick={handleSubmit}
                  className="w-full bg-[#5cbba8] text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Medical Emergency</h3>
              <p className="text-red-700 mt-1">
                If you're experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
                Do not use this contact form for urgent medical situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;