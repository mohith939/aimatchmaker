import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Loading() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
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

        <Tabs defaultValue="athletes">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="leagues">Leagues</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
          </TabsList>
          <TabsContent value="athletes" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="h-40 w-full" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
