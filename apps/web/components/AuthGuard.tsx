"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isLoginPage = pathname.startsWith("/login");

    if (!isLoggedIn && !isLoginPage) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // On login pages always render
  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
