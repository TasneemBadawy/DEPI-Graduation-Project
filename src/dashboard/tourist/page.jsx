"use client";
import TouristDashboard from "../../components/tourist/TouristDashboard";
import { getCurrentUser } from "../../lib/auth";

const DEMO_USER = { id: "u2", name: "Sofia Martinez", email: "sofia@gmail.com", role: "tourist", initials: "TR" };

export default function TouristPage() {
  // Falls back to a demo user so this page still renders something sensible
  // if it's opened directly without going through Login/Register first.
  const user = getCurrentUser()?.role === "tourist" ? getCurrentUser() : DEMO_USER;
  return <TouristDashboard user={user} />;
}
