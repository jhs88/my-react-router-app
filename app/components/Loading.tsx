import { Card, CardContent } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { Skeleton } from "~/components/ui/skeleton";

/** Renders a loading component with a specified limit of skeleton cards. */
export default function Loading({ limit }: { limit?: number }) {
  return Array.from({ length: limit ?? 10 }).map((_, i) => (
    <SkeleCard key={`loading-gi-${i}`} />
  ));
}

/** Renders a skeleton card with a flip effect. */
function SkeleCard() {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden rounded-none shadow-none">
      <div className="aspect-video w-full bg-muted animate-pulse" />
      <CardContent className="p-4 flex-1 space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Renders a popup loader component. */
export function PopupLoader() {
  return (
    <div className="flex items-center justify-center my-20" aria-live="polite">
      <Card className="shadow-md">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-3xl font-bold tracking-tight">Loading...</p>
          <Spinner className="size-10" />
          <p className="text-sm text-muted-foreground">
            This will take a couple seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
