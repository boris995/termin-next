"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export function ToastFromSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (!error && !success) {
      return;
    }

    if (error) {
      showToast(error, "error");
    }

    if (success) {
      showToast(success, "success");
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("error");
    nextParams.delete("success");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, showToast]);

  return null;
}
