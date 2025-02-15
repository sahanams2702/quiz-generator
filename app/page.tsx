import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/footer';
import Link from 'next/link';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto py-6"> {/* Reduced top padding from py-10 to py-6 */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="mt-8">
                <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                  Ready to Test Your Knowledge?
                </h2>

                <p className="text-lg text-muted-foreground mt-2 animate-shimmer">
                  Take a quiz now and see how well you know the topics!
                </p>
                <div className="relative animate-float">
                  <img
                    src="/assets/images/qz11.png"
                    alt="Learning"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="mt-2">
                    <Link href="/quiz">
                      {/* Add your CTA button or other link text here */}
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
                    imageSrc="/assets/images/h1.png" // Image for Create Custom Quizzes
                    title="Create Custom Quizzes"
                    value=""
                    description=""
                  />
                  <StatsCard
                    imageSrc="/assets/images/h2.png" // Image for Diverse Quiz Topics
                    title="Diverse Quiz Topics"
                    value=""
                    description=""
                  />
                </div>
                <div className="space-y-6 lg:mt-12">
                  <StatsCard
                    imageSrc="/assets/images/h3.png" // Image for Dynamic Quiz Generation
                    title="Dynamic Quiz Generation"
                    value=""
                    description=""
                  />
                  <StatsCard
                    imageSrc="/assets/images/h4.png" // Image for Seamless User Interface
                    title="Seamless User Interface"
                    value=""
                    description=""
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

function StatsCard({ imageSrc, title, value, description }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-px bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
      <div className="relative bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Image instead of icon */}
          <img src={imageSrc} alt={""} className="w-12 h-12 object-contain" />
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
