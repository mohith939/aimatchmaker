'use client';

import { useState } from 'react';
import BriefForm from '@/components/kibi/BriefForm';
import RecommendationsTabs from '@/components/kibi/RecommendationsTabs';
import { RecommendationResult } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

function RecommendationsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
       <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex gap-2 items-center shrink-0">
              <Skeleton className="h-11 w-40" />
              <Skeleton className="h-11 w-36" />
            </div>
        </div>
        <Skeleton className="h-10 w-[400px] mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="p-2 border-t">
                     <Skeleton className="h-8 w-full" />
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}


export default function Home() {
    const [results, setResults] = useState<RecommendationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = (res: RecommendationResult) => {
        setResults(res);
        setIsLoading(false);
    }

    const handleFormStart = () => {
      setIsLoading(true);
    }

    if (isLoading) {
        return (
             <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <RecommendationsSkeleton />
             </main>
        )
    }

    if (results) {
      return (
         <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <RecommendationsTabs
                    brief={results.brief}
                    athletes={results.athletes}
                    leagues={results.leagues}
                    venues={results.venues}
                />
            </div>
         </main>
      );
    }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-card border rounded-xl p-8 md:p-12 mb-12 shadow-sm text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                Sponsorship <span className="text-primary">Matchmaker</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Find the perfect athletes, leagues, and venues for your brand.
                Submit your campaign brief to get instant, AI-powered
                recommendations.
            </p>
        </div>
        <BriefForm onFormSubmit={handleFormSubmit} onFormStart={handleFormStart}/>
      </div>
    </main>
  );
}
