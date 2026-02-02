import { WelcomeScreen } from "@/components/WelcomeScreen";

/**
 * Entry: welcome screen asks for name and role, then user clicks "Enter Lobby"
 * and is taken to /lobby. Name is stored in sessionStorage and used when joining Daily.
 */
export default function HomePage() {
  return <WelcomeScreen />;
}
