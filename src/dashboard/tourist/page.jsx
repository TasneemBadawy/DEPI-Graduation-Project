"use client";
import TouristDashboard from "../../components/tourist/TouristDashboard";


export default function TouristPage() {
  const mockUser = { id: "u2", name: "Sofia Martinez", email: "sofia@gmail.com", role: "tourist", initials: "TR" };
  return <TouristDashboard user={mockUser} />;
}
