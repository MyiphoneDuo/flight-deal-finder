import { AuthForm } from "@/components/AuthForm";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function SignUp() {
  usePageMeta({
    title: "Create account — Flight Price Notifier",
    description: "Create your Flight Price Notifier account.",
    ogTitle: "Create account — Flight Price Notifier",
    ogDescription: "Start watching flight prices from Taipei.",
    twitterCard: "summary",
  });
  return <AuthForm mode="sign-up" />;
}
