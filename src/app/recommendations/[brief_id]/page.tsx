import { Suspense } from 'react';
import { getRecommendations } from '@/lib/actions';
import RecommendationsTabs from '@/components/kibi/RecommendationsTabs';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default async function RecommendationsPage({
  params,
}: {
  params: { brief_id: string };
}) {
  const { brief, athletes, leagues, venues } = await getRecommendations(params.brief_id);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                    Your Recommended Matches
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Based on your brief for <span className="font-semibold text-foreground">{brief.brand_name}</span>.
                </p>
            </div>
            <div className="flex gap-2 items-center shrink-0">
                <Button variant="outline" size="lg">
                    <Mail className="mr-2" />
                    Email Shortlist
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            Book a Demo
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Demo Request Sent!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Thank you for your interest! A KIBI sponsorship strategist will contact you shortly at <span className="font-bold text-foreground">{brief.primary_contact.email}</span> to schedule your demo and unlock full profiles.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
        
        <Suspense fallback={<p>Loading recommendations...</p>}>
          <RecommendationsTabs
            brief={brief}
            athletes={athletes}
            leagues={leagues}
            venues={venues}
          />
        </Suspense>
      </div>
    </main>
  );
}
