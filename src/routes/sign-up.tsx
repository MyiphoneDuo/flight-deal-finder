import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/sign-up")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Create account — Flight Price Notifier" },
    { name: "description", content: "Create your Flight Price Notifier account." },
    { property: "og:title", content: "Create account — Flight Price Notifier" },
    { property: "og:description", content: "Start watching flight prices from Taipei." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => <AuthForm mode="sign-up" />,
});