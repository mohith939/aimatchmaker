import { Suspense } from 'react';
import { getRecommendations } from '@/lib/actions';
import RecommendationsTabs from '@/components/kibi/RecommendationsTabs';

export default async function RecommendationsPage({
  params,
  searchParams,
}: {
  params: { brief_id: string };
  searchParams: { brief?: string };
}) {
  const { brief, athletes, leagues, venues } = await getRecommendations(
    params.brief_id,
    searchParams.brief
  );

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
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
