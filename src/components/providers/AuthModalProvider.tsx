"use client";

import React, { createContext, useContext, useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

interface AuthModalContextType {
  openAuthModal: (defaultTab?: "login" | "signup") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const openAuthModal = (defaultTab: "login" | "signup" = "login") => {
    setActiveTab(defaultTab);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal 
        isOpen={isOpen} 
        onClose={closeAuthModal} 
        initialTab={activeTab}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
