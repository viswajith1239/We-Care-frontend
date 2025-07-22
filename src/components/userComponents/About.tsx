import React, { useEffect, useState } from 'react';
import { Heart, Shield, Clock, Users, Award, Phone, Mail, MapPin, Headphones, Eye, User } from 'lucide-react';
import { Specialization } from '../../types/doctor';
import { useNavigate } from "react-router-dom"
import { getdoctors, getspecializations, getusers } from '../../service/userService';


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const About: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  const [doctorsData, setDoctorsData] = useState(0);
  const [users, setUsers] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const getSpecializations = async () => {
      try {
        const response = await getspecializations()
        console.log("nnn", response);

        setSpecializations(response.data);
      } catch (error) {
        console.log("Error fetching specializations:", error);
      }
    };
    getSpecializations();
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getusers()
        console.log("reee", response);

        setUsers(response.data.response.length);

      } catch (err: any) {
        console.log("errro fetching user", err);


      }
    };

    fetchUsers();
  }, []);



  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await getdoctors()
        const doctors = response.data;
        console.log("vvvv", doctors)


        setDoctorsData(doctors.length);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }
    fetchDoctors();
  }, []);

  const getIconForSpecialization = (name: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'cardiology': <Heart className="w-6 h-6 text-white" />,
      'dermatology': <Users className="w-6 h-6 text-white" />,
      'pediatrics': <Shield className="w-6 h-6 text-white" />,
      'orthopedics': <Award className="w-6 h-6 text-white" />,
      'neurology': <Clock className="w-6 h-6 text-white" />,
      'ent': <Headphones className="w-6 h-6 text-white" />,
      'skin specialist': <User className="w-6 h-6 text-white" />,
      'ophthalmologist': <Eye className="w-6 h-6 text-white" />,
    };

    const key = name.toLowerCase();
    return iconMap[key] || <Heart className="w-6 h-6 text-white" />;
  };


  const getCardColor = (index: number) => {
    return index % 2 === 0 ? 'bg-[#5cbba8]' : 'bg-black';
  };


  const displayedSpecializations = showAllSpecializations
    ? specializations
    : specializations.slice(0, 4);

  const handleFindDoctor = () => {
    navigate('/doctors');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <section className=" text-black py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About WeCare
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-black">
              Connecting you with quality healthcare, anytime, anywhere
            </p>
            <p className="text-lg text-black max-w-3xl mx-auto">
              We're revolutionizing healthcare access by making it simple, secure, and efficient
              to find and book appointments with trusted medical professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Trending Specializations
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Discover our comprehensive range of medical specialties
            </p>

            {specializations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedSpecializations.map((specialization, index) => (
                  <div
                    key={specialization.id || index}
                    className={`${getCardColor(index)} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-4">
                      {getIconForSpecialization(specialization.name)}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{specialization.name}</h3>
                    <p className="text-sm text-white text-opacity-90 mb-3">
                      {specialization.description || `Expert ${specialization.name.toLowerCase()} specialists`}
                    </p>
                    <div className="text-sm font-medium">
                      {specialization.doctorCount ? `${specialization.doctorCount}+ Doctors Available` : 'Doctors Available'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading specializations...</p>
              </div>
            )}


            {specializations.length > 4 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                  className="bg-[#5cbba8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a9d8e] transition-colors"
                >
                  {showAllSpecializations ? 'Show Less' : 'View All Specializations'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At WeCare, we believe that everyone deserves easy access to quality healthcare.
              Our mission is to bridge the gap between patients and healthcare providers by offering
              a seamless, user-friendly platform that simplifies the appointment booking process.
            </p>
            <div className="grid md:grid-cols-2 gap-0">
              <StatCard number={`${users}+`} label="Happy Patients" />
              <StatCard number={`${doctorsData}+`} label="Medical Specialties" />
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose WeCare?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="24/7 Booking"
              description="Book appointments anytime, anywhere with our easy-to-use online platform. No more waiting on hold or limited office hours."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Secure & Private"
              description="Your health information is protected with bank-level security. We're fully HIPAA compliant and prioritize your privacy."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Verified Doctors"
              description="All healthcare providers on our platform are thoroughly vetted and licensed professionals with verified credentials."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-blue-600" />}
              title="Comprehensive Care"
              description="From routine check-ups to specialist consultations, find the right healthcare professional for your needs."
            />
            <FeatureCard
              icon={<Award className="w-6 h-6 text-blue-600" />}
              title="Quality Assurance"
              description="We maintain high standards through patient reviews, ratings, and continuous quality monitoring."
            />
            <FeatureCard
              icon={<Phone className="w-6 h-6 text-blue-600" />}
              title="24/7 Support"
              description="Our dedicated support team is available around the clock to assist you with any questions or concerns."
            />
          </div>
        </div>
      </section>


      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient-Centered</h3>
                <p className="text-gray-600">
                  Every decision we make is guided by what's best for patients. We prioritize
                  accessibility, convenience, and quality care above all else.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  We continuously evolve our platform using the latest technology to improve
                  healthcare delivery and patient experience.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We believe in clear communication, honest pricing, and transparent processes
                  that build trust between patients and providers.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Reliability</h3>
                <p className="text-gray-600">
                  You can count on us to provide consistent, dependable service when you need
                  healthcare most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-12">
              Have questions about our platform or need assistance? We're here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
                <p className="text-gray-600">1-800-HEALTH-1</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
                <p className="text-gray-600">support@WeCare.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Headquarters</h3>
                <p className="text-gray-600">123 Healthcare Ave</p>
                <p className="text-gray-600">Medical City, MC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16  text-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Ready to Get Started?</h2>
          <p className="text-xl text-black-100 mb-8">
            Join thousands of patients who trust WeCare for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleFindDoctor} className="bg-[#5cbba8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5cbba8] transition-colors">
              Find a Doctor
            </button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;