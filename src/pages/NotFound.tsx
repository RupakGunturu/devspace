import { useEffect } from "react";
import { NotFoundPage } from "@/components/ui/404-page-not-found";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — DevSpace";
  }, []);

  return <NotFoundPage />;
}
