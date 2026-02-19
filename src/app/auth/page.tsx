"use client";

import { Calendar } from "@/components/ui/calendar";
import * as React from "react"

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[350px]">
      <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
      </div>
    </div>
  );
}

