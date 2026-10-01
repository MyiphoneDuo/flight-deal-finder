import type { User } from "@supabase/supabase-js";
import { redirect, useRouteLoaderData } from "react-router";

import { supabase } from "@/integrations/supabase/client";

export async function requireUser(): Promise<{ user: User }> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw redirect("/sign-in");
  }
  return { user: data.user };
}

export function useAuthenticatedUser(): User {
  const data = useRouteLoaderData("authenticated") as Awaited<ReturnType<typeof requireUser>>;
  return data.user;
}
