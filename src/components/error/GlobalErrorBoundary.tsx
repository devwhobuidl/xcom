'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Global Error Boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">💀</div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">THE PIT IS UNDER ATTACK</h1>
            <p className="text-white/50 mb-8 font-medium">Something went wrong. Nikita's agents are trying to stop us.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-2xl text-lg font-black italic uppercase tracking-tighter transition-all"
              >
                RELOAD THE REBELLION
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-white/5 hover:bg-white/10 text-white/50 px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all"
              >
                Back to Safety
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
