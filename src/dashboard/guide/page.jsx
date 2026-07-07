"use client";
import GuideDashboard from "../../components/guide/GuideDashboard";
import { getCurrentUser } from "../../lib/auth";

const DEMO_USER = { id: "u1", name: "Yara Adel", email: "yara@nomade.com", role: "guide", initials: "YR", verified: true, rating: 4.92 };

export default function GuidePage() {
  const user = getCurrentUser()?.role === "guide" ? getCurrentUser() : DEMO_USER;
  return <GuideDashboard user={user} />;
}
