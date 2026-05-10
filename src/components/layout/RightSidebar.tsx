"use client";

import React from "react";
import { TreasuryStats } from "../widgets/TreasuryStats";
import { SuggestedHaters } from "../widgets/SuggestedHaters";
import { TrendingWidget } from "../widgets/TrendingWidget";
import { XcomPrice } from "../widgets/XcomPrice";
import { NotificationsPreview } from "../widgets/NotificationsPreview";
import { useSession } from "next-auth/react";
import { WidgetErrorBoundary } from "../widgets/WidgetErrorBoundary";

export function RightSidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <WidgetErrorBoundary name="Market Data">
        <XcomPrice />
      </WidgetErrorBoundary>
      
      {session && (
        <WidgetErrorBoundary name="Intelligence">
          <NotificationsPreview />
        </WidgetErrorBoundary>
      )}
      
      <WidgetErrorBoundary name="War Chest">
        <TreasuryStats />
      </WidgetErrorBoundary>
      
      <WidgetErrorBoundary name="Rebel Recon">
        <SuggestedHaters />
      </WidgetErrorBoundary>
      
      <WidgetErrorBoundary name="Trending Chaos">
        <TrendingWidget />
      </WidgetErrorBoundary>
    </div>
  );
}
