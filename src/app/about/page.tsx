import React from 'react';
import { Brain, Target, Users, Award } from 'lucide-react';
import Header from '@/components/header';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      
      <Header/>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center md:flex items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-6">About QuizGenius</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing learning through AI-powered quizzes and personalized education.
              Our mission is to make learning more engaging, effective, and accessible for everyone.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img 
              src="/assets/images/about.jpg" 
              alt="QuizGenius Hero" 
              className="rounded-lg shadow-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Learning"
              description="Our advanced AI algorithms create personalized quizzes tailored to your learning style and progress."
              image="/assets/images/ab1.jpg"
            />
            <FeatureCard
              icon={Target}
              title="Targeted Practice"
              description="Focus on areas where you need improvement with our adaptive learning system."
              image="/assets/images/ab2.webp"
            />
            <FeatureCard
              icon={Users}
              title="Community Learning"
              description="Join a community of learners and share knowledge through collaborative features."
              image="/assets/images/ab3.webp"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="10k+" label="Active Users" />
            <StatCard number="50k+" label="Quizzes Completed" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="100+" label="Topics Covered" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Award className="h-12 w-12 mx-auto text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              At QuizGenius, we believe that everyone deserves access to high-quality education.
              Our platform combines cutting-edge AI technology with proven learning methodologies
              to create an engaging and effective learning experience.
            </p>
            <div>
              <img 
                src="/assets/images/ab4.webp" 
                alt="Our Team"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
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
