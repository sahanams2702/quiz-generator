'use client';

import { Brain, Target, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import {getNumberOfQuizzes, getNumberOfUsers} from './action';
export default function About() {

  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfQuizzes, setNumberOfQuizzes] = useState(0);
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
          const userCount = await getNumberOfUsers();
          setNumberOfUsers(userCount);
      } catch (error) {
          console.error("Error fetching user count:", error);
      }
  };
  fetchUserCount();

  const fetchQuizCount = async () => {
    try {
        const quizCount = await getNumberOfQuizzes();
        setNumberOfQuizzes(quizCount);
    } catch (error) {
        console.error("Error fetching quiz count:", error);
    }
  }
  fetchQuizCount();

  }, []);

  return (
    <div className="min-h-screen bg-background">
      
      <Header/>

      {/* Hero Section */}
      <section className="py-2 px-4">
        <div className="container mx-auto text-center md:flex items-center justify-between">
          <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">About QuizEZ
          </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            "We’re revolutionizing learning with AI-powered quizzes that enhances your progress, making education more engaging and personalized. Our mission is to empower learners through dynamic, real-time feedback and tailored challenges for every subject".
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="/assets/images/about.png" 
              alt="QuizGenius Hero" 
              className="rounded-lg shadow-lg object-cover w-full h-full opacity-85"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 ">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            <FeatureCard
              icon={Brain}
              title="Transforming Learning with AI"
              description="We revolutionize education by harnessing AI technology to create personalized quizzes that adapt to your learning style and progress, making education more engaging and effective.."
              image="/assets/images/ab1.jpg"
            />
            <FeatureCard
              icon={Target}
              title="Our Technology"
              description="Using the advanced AI models, our platform dynamically generates quizzes on-the-fly with real-time feedback, personalized recommendations, and adaptive learning features ensuring continuous learning improvement."
              image="/assets/images/ab2.webp"
            />
            <FeatureCard
              icon={Users}
              title="Our Commitment"
              description="We are committed to building an adaptive learning platform that evolves with you, tracking performance and providing personalized resources to make learning efficient, enjoyable, and tailored to your needs"
              image="/assets/images/ab3.webp"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number={`${numberOfUsers}+`} label="Number of Users" />
            <StatCard number={`${numberOfQuizzes}+`} label="Number of Quizzes generated" />
            <StatCard number="9" label="Active users" />
            <StatCard number="10+" label="Topics Covered" />
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, image }) {
  return (
    <div className="p-6 rounded-lg border bg-background hover:shadow-lg transition-shadow">
      <Icon className="h-10 w-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {image && (
        <img
          src={image}
          alt={title}
          className="mt-4 rounded-lg shadow-lg w-full object-cover h-32"
        />
      )}
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg border bg-background">
      <div className="text-3xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
