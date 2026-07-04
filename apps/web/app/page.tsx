import { redirect } from "next/navigation";

// The app root sends authenticated users to their dashboard; everyone else is
// bounced to /login by the /app guard. The public marketing site is apps/www.
export default function RootPage() {
  redirect("/app");
}
