"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CALENDAR_ROUTE } from "@/const/routes-const";
import dayjs from "dayjs";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    router.push(`${CALENDAR_ROUTE}?view=day&date=${today}`);
  }, [router]);

  return null;
}
