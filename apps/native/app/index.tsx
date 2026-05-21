import OnboardingSplashContainer from "@/components/containers/onboarding-splash-container";
import Onboardingtemplate from "@/components/templates/onboarding-template";
import { useAuthSession } from "@/hooks/use-auth-session";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
const SPLASH_DURATION_MS = 1500;

// index.tsx
export default function Index() {
  const router = useRouter();
  const { data: session, isPending } = useAuthSession();
  const [splashDone, setSplashDone] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSplashDone(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!splashDone || isPending) return;
    if (hasRedirected.current) return; // ← already redirected once, stop watching

    const user = session?.data?.user;
    if (!user) return;

    hasRedirected.current = true; // ← mark before navigating

    if (user.onboardingCompleted) {
      router.replace("/(drawer)/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [splashDone, isPending, session?.data?.user?.onboardingCompleted]);

  if (!splashDone || isPending) {
    return (
      <OnboardingSplashContainer message="Cashory makes managing your money simple, secure and smart" />
    );
  }

  return <Onboardingtemplate />;
}
