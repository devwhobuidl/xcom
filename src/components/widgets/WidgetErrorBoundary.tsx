"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  name: string;
}

interface State {
  hasError: boolean;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`WIDGET_CRASH [${this.props.name}]:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-zinc-900/50 border border-red-900/20 rounded-2xl text-center">
          <AlertCircle className="w-5 h-5 text-red-500/50 mx-auto mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            {this.props.name} offline
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
