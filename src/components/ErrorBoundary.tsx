"use client";

import React, { Component, ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            backgroundColor: "#1a1a2e",
            color: "#eee",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              opacity: 0.8,
              marginBottom: "1.5rem",
              maxWidth: "400px",
            }}
          >
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre
              style={{
                fontSize: "0.75rem",
                backgroundColor: "rgba(0,0,0,0.3)",
                padding: "1rem",
                borderRadius: "8px",
                maxWidth: "90%",
                overflow: "auto",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            <RotateCcw size={18} />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
