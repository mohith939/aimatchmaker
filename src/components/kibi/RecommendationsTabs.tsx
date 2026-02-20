'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Brief, Athlete, League, Venue } from "@/lib/types";
import RecommendationCard from "./RecommendationCard";
import { Users, Shield, Building, Frown, Mail, PartyPopper } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface RecommendationsTabsProps {
  brief: Brief;
  athletes: (Athlete & { matchScore: number })[];
  leagues: (League & { matchScore: number })[];
  venues: (Venue & { matchScore: number })[];
}

const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg mt-8 bg-card">
        <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold font-headline">No Matching {type} Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
            We couldn't find any {type.toLowerCase()} that perfectly match your brief.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your brief or contact us for a curated list.
        </p>
    </div>
)

export default function RecommendationsTabs({
  brief,
  athletes,
  leagues,
  venues,
}: RecommendationsTabsProps) {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const { toast } = useToast();

  const handleShortlistToggle = (id: string) => {
    setShortlist((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEmailShortlist = () => {
    toast({
      title: "Shortlist Emailed!",
      description: `Your shortlist of ${shortlist.length} recommendations has been sent to ${brief.primary_contact.email}.`,
    });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 bg-card border rounded-xl p-6 shadow-sm">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                    Your Recommended Matches
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Based on your brief for <span className="font-semibold text-foreground">{brief.brand_name}</span>.
                </p>
            </div>
            <div className="flex gap-2 items-center shrink-0">
                <Button variant="outline" size="lg" onClick={handleEmailShortlist} disabled={shortlist.length === 0}>
                    <Mail className="mr-2" />
                    Email Shortlist ({shortlist.length})
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PartyPopper className="mr-2"/>
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

      <Tabs defaultValue="athletes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="athletes">
            <Users className="mr-2 h-4 w-4" />
            Athletes ({athletes.length})
          </TabsTrigger>
          <TabsTrigger value="leagues">
            <Shield className="mr-2 h-4 w-4" />
            Leagues ({leagues.length})
          </TabsTrigger>
          <TabsTrigger value="venues">
            <Building className="mr-2 h-4 w-4" />
            Venues ({venues.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="athletes" className="mt-6">
          {athletes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {athletes.map((item) => (
                      <RecommendationCard 
                        key={item.id} 
                        item={item} 
                        brief={brief} 
                        isShortlisted={shortlist.includes(item.id)}
                        onShortlistToggle={handleShortlistToggle}
                      />
                  ))}
              </div>
          ) : <EmptyState type="Athletes" />}
        </TabsContent>
        
        <TabsContent value="leagues" className="mt-6">
          {leagues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {leagues.map((item) => (
                      <RecommendationCard 
                        key={item.id} 
                        item={item} 
                        brief={brief} 
                        isShortlisted={shortlist.includes(item.id)}
                        onShortlistToggle={handleShortlistToggle}
                      />
                  ))}
              </div>
          ) : <EmptyState type="Leagues" />}
        </TabsContent>

        <TabsContent value="venues" className="mt-6">
          {venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {venues.map((item) => (
                      <RecommendationCard 
                        key={item.id} 
                        item={item} 
                        brief={brief}
                        isShortlisted={shortlist.includes(item.id)}
                        onShortlistToggle={handleShortlistToggle}
                      />
                  ))}
              </div>
          ) : <EmptyState type="Venues" />}
        </TabsContent>
      </Tabs>
    </>
  );
}
