"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div 
          className="error-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ff0066',
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <h2 style={{ 
            fontSize: '3rem', 
            marginBottom: '2rem',
            textShadow: '0 0 10px rgba(255, 0, 102, 0.8)'
          }}>
            Something went wrong
          </h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(0, 255, 170, 0.2)',
              border: '2px solid #00ffaa',
              borderRadius: '8px',
              color: '#00ffaa',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(0, 255, 170, 0.3)'
            }}
          >
            Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}