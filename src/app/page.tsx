import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Users, CheckCircle, Trophy } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/footer';
import Link from 'next/link';
import Header from '@/components/header';

export default function Home() {
  return (

    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto py-20 px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              {/* Replaced the heading and paragraph with an image and simple CTA */}
              <div className="text-center">
                <img src="/assets/images/qz.avif" alt="Quiz Image" className="mx-auto max-w-full h-auto rounded-lg" />

                <div className="mt-8">
                  <h2 className="text-3xl font-semibold text-muted-foreground animate-shimmer">
                    Ready to Test Your Knowledge?
                  </h2>
                  <p className="text-lg text-muted-foreground mt-2 animate-shimmer">
                    Take a quiz now and see how well you know the topics!
                  </p>
                  <div className="mt-4">
                  <Link href="/quiz">
  <Button 
    size="lg" 
    className="animate-shimmer bg-blue-500 hover:bg-blue-600 text-white border-white"
  >
    Take the Quiz
  </Button>
</Link>


                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <StatsCard
                    icon={Users}
                    title="Active Users"
                    value="10,000+"
                    description="Growing community"
                  />
                  <StatsCard
                    icon={CheckCircle}
                    title="Quizzes Taken"
                    value="50,000+"
                    description="Tests completed"
                  />
                </div>
                <div className="space-y-6 lg:mt-12">
                  <StatsCard
                    icon={Trophy}
                    title="Success Rate"
                    value="95%"
                    description="Student satisfaction"
                  />
                  <StatsCard
                    icon={Brain}
                    title="Topics"
                    value="100+"
                    description="Available subjects"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatsCard({ icon: Icon, title, value, description }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-px bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
      <div className="relative bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-4">
          <Icon className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold tracking-tight">{value}</span>
              <span className="text-sm text-muted-foreground">{description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
