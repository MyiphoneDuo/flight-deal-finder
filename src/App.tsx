import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { requireUser } from "@/lib/auth";
import AppDashboard from "@/pages/AppDashboard";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: () => null,
    children: [
      { path: "/", element: <Index /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      {
        // Authenticated area: redirects to /sign-in when there is no Supabase user.
        id: "authenticated",
        loader: requireUser,
        element: <Outlet />,
        children: [{ path: "/app", element: <AppDashboard /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
