"use client";

import { createContext, useContext } from "react";

type PremiumContextValue = {
  active: boolean;
};

const PremiumContext = createContext<PremiumContextValue>({ active: false });

export function PremiumProvider({
  active,
  children
}: Readonly<{
  active: boolean;
  children: React.ReactNode;
}>) {
  return (
    <PremiumContext.Provider value={{ active }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}

export function getPremiumLockMessage(action = "utiliser cette fonctionnalité") {
  return `Mode aperçu: active l'essai gratuit de 30 jours pour ${action}.`;
}
