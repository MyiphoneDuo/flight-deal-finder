import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/sign-in")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Sign in — Flight Price Notifier" },
    { name: "description", content: "Sign in to Flight Price Notifier." },
    { property: "og:title", content: "Sign in — Flight Price Notifier" },
    { property: "og:description", content: "Access your flight price tracking dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => <AuthForm mode="sign-in" />,
});