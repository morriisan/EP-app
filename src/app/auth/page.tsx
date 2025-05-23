"use client";

import { Calendar } from "@/components/ui/calendar";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[350px]">
        <Calendar
          mode="single"
          className="rounded-md border"
        />
      </div>
    </div>
  );
}