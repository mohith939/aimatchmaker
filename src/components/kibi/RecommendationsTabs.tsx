import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Brief, Athlete, League, Venue } from "@/lib/types";
import RecommendationCard from "./RecommendationCard";
import { Users, Shield, Building, Frown } from "lucide-react";

interface RecommendationsTabsProps {
  brief: Brief;
  athletes: (Athlete & { matchScore: number })[];
  leagues: (League & { matchScore: number })[];
  venues: (Venue & { matchScore: number })[];
}

const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
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
  return (
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
                    <RecommendationCard key={item.id} item={item} brief={brief} />
                ))}
            </div>
        ) : <EmptyState type="Athletes" />}
      </TabsContent>
      
      <TabsContent value="leagues" className="mt-6">
         {leagues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {leagues.map((item) => (
                    <RecommendationCard key={item.id} item={item} brief={brief} />
                ))}
            </div>
         ) : <EmptyState type="Leagues" />}
      </TabsContent>

      <TabsContent value="venues" className="mt-6">
        {venues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {venues.map((item) => (
                    <RecommendationCard key={item.id} item={item} brief={brief} />
                ))}
            </div>
        ) : <EmptyState type="Venues" />}
      </TabsContent>
    </Tabs>
  );
}
