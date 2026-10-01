import { AuthForm } from "@/components/AuthForm";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function SignIn() {
  usePageMeta({
    title: "Sign in — Flight Price Notifier",
    description: "Sign in to Flight Price Notifier.",
    ogTitle: "Sign in — Flight Price Notifier",
    ogDescription: "Access your flight price tracking dashboard.",
    twitterCard: "summary",
  });
  return <AuthForm mode="sign-in" />;
}
