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
            <h1 className="text-4xl font-bold mb-4">THE PIT IS UNDER ATTACK</h1>
            <p className="text-xl mb-8">Something went wrong. Nikita's agents are trying to stop us.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-lg font-bold"
            >
              RELOAD THE REBELLION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
