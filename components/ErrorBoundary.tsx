import React, { Component, ReactNode } from 'react';
import ContentCard from './ContentCard.js';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: The component's state was not initialized, leading to multiple errors when trying to access `this.state`, `this.setState`, or `this.props`.
  // Adding a constructor correctly initializes the state and makes the component's properties and state accessible, resolving all related errors.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main id="main-content" className="flex-grow container mx-auto px-4 py-8 md:px-6 relative">
            <ContentCard title="SYSTEM FAULT DETECTED" titleClassName="text-accent-warning text-3xl">
                 <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
                    <h3 className="font-bold text-lg text-red-300">A non-conforming condition was detected, causing a subsystem to fail.</h3>
                    <p className="text-red-300/80 mt-2">
                        This part of the OS has encountered a critical error and cannot be displayed.
                        Please try reloading the application. If the problem persists, you may need to perform a system reset from the header menu.
                    </p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-accent-blue text-background-dark font-semibold rounded">
                        Reload OS
                    </button>
                </div>
                
                {this.state.error && (
                    <details open className="mt-4 p-2 bg-gray-800 rounded text-sm">
                        <summary className="cursor-pointer font-semibold text-gray-400">View Technical Diagnostics</summary>
                        <div className="mt-2 pt-2 border-t border-gray-700">
                            <h4 className="font-bold text-accent-warning">Error Message:</h4>
                            <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap text-red-400">
                                <code>{this.state.error.toString()}</code>
                            </pre>
                            
                            {this.state.errorInfo && (
                                <>
                                    <h4 className="font-bold text-accent-warning mt-4">Component Stack Trace (Where the error occurred):</h4>
                                    <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap text-gray-300 text-xs">
                                        <code>{this.state.errorInfo.componentStack}</code>
                                    </pre>
                                </>
                            )}
                        </div>
                    </details>
                )}
            </ContentCard>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;