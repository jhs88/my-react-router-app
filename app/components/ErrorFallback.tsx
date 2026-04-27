import { isRouteErrorResponse } from "react-router";

export function ErrorFallback({ error }: { error: unknown }) {
  return (
    <div
      className="flex items-center justify-center min-h-[400px] p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-destructive">
          {isRouteErrorResponse(error) ? error.status : 500}
        </h1>
        <p className="text-xl text-muted-foreground">
          {isRouteErrorResponse(error)
            ? (error.data.message ?? error.data)
            : error instanceof Error
              ? error.message
              : "An Unknown error occurred"}
        </p>
      </div>
    </div>
  );
}
