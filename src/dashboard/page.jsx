"use client";
import { Navigate } from "react-router-dom";
import { getCurrentUser, dashboardPathForRole } from "../lib/auth";

// A bare "/dashboard" visit lands here and gets bounced to whichever
// dashboard matches the signed-in user's role (tourist if no session exists).
export default function DashboardRoot() {
  const user = getCurrentUser();
  return <Navigate to={dashboardPathForRole(user?.role)} replace />;
}
