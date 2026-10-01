import { useEffect } from "react";

type PageMeta = {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Client-side replacement for TanStack's per-route `head()` meta. */
export function usePageMeta({ title, description, ogTitle, ogDescription, twitterCard }: PageMeta) {
  useEffect(() => {
    document.title = title;
    if (description) setMeta("name", "description", description);
    if (ogTitle) setMeta("property", "og:title", ogTitle);
    if (ogDescription) setMeta("property", "og:description", ogDescription);
    setMeta("property", "og:type", "website");
    if (twitterCard) setMeta("name", "twitter:card", twitterCard);
  }, [title, description, ogTitle, ogDescription, twitterCard]);
}
