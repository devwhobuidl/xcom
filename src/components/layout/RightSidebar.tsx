"use client";

import React from "react";
import { TreasuryStats } from "../widgets/TreasuryStats";
import { SuggestedHaters } from "../widgets/SuggestedHaters";
import { TrendingWidget } from "../widgets/TrendingWidget";
import { XcomPrice } from "../widgets/XcomPrice";
import { NotificationsPreview } from "../widgets/NotificationsPreview";
import { useSession } from "next-auth/react";

export function RightSidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <XcomPrice />
      {session && <NotificationsPreview />}
      <TreasuryStats />
      <SuggestedHaters />
      <TrendingWidget />
    </div>
  );
}
