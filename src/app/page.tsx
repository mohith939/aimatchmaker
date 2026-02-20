'use client';

import { useEffect, useState } from 'react';
import BriefForm from '@/components/kibi/BriefForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

function BriefFormSkeleton() {
  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-2 w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div></div>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}


export default function Home() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-card border rounded-xl p-8 md:p-12 mb-12 shadow-sm">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                    Sponsorship <span className="text-primary">Matchmaker</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                    Find the perfect athletes, leagues, and venues for your brand.
                    Submit your campaign brief to get instant, AI-powered
                    recommendations.
                </p>
            </div>
        </div>
        {isClient ? <BriefForm /> : <BriefFormSkeleton />}
      </div>
    </main>
  );
}
