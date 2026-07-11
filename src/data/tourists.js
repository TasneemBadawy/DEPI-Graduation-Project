export const TOURISTS = [
  { id: "t1", name: "Sofia Martinez", email: "sofia.m@mail.com", country: "Spain", joinedDate: "Apr 2025", trips: 7, status: "Active" },
  { id: "t2", name: "Liam O'Connor", email: "liam@mail.com", country: "Ireland", joinedDate: "Jul 2025", trips: 4, status: "Active" },
  { id: "t3", name: "Hana Tanaka", email: "hana@mail.com", country: "Japan", joinedDate: "Sep 2025", trips: 2, status: "Active" },
  { id: "t4", name: "Noah Becker", email: "noah@mail.com", country: "Germany", joinedDate: "Feb 2026", trips: 1, status: "New" },
  { id: "t5", name: "Priya Shah", email: "priya@mail.com", country: "India", joinedDate: "Jun 2026", trips: 0, status: "New" },
  { id: "t6", name: "Lucas Silva", email: "lucas@mail.com", country: "Brazil", joinedDate: "Aug 2024", trips: 11, status: "Active" },
  { id: "t7", name: "Emma Wilson", email: "emma.w@mail.com", country: "United States", joinedDate: "Oct 2024", trips: 5, status: "Active" },
];

export function getInitials(name) {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase();
}
