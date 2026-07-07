"use client";
import GuideDashboard from "../../components/guide/GuideDashboard";


export default function GuidePage() {
  const mockUser = { id: "u1", name: "Yara Adel", email: "yara@nomade.com", role: "guide", initials: "YR", verified: true, rating: 4.92 };
  return <GuideDashboard user={mockUser} />;
}
