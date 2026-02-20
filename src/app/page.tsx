import BriefForm from '@/components/kibi/BriefForm';

export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Sponsorship Matchmaker
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect athletes, leagues, and venues for your brand.
            Submit your campaign brief to get instant, AI-powered
            recommendations.
          </p>
        </div>
        <BriefForm />
      </div>
    </main>
  );
}
