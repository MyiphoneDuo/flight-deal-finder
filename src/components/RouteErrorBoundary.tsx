import { useEffect } from "react";
import { isRouteErrorResponse, useRevalidator, useRouteError } from "react-router";

import { reportLovableError } from "@/lib/lovable-error-reporting";
import NotFound from "@/pages/NotFound";

export function RouteErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "router_root_error_element" });
  }, [error]);

  // Unknown URLs are handled by the "*" route; a 404 thrown from a loader lands here.
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              void revalidator.revalidate();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
