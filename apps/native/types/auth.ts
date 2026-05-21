import type { Session } from "better-auth/types";

export interface LedgerlyUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  onboardingCompleted: boolean;
  country?: string | null;
  phone?: string | null;
}

export interface LedgerlySession extends Session {
  user: LedgerlyUser;
}
