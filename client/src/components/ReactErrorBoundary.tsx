import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ReactErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ReactErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ReactErrorBoundary componentDidCatch:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold text-red-600 mb-4">React Error Detected</h1>
            <div className="text-left bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold text-gray-800 mb-2">Error:</h3>
              <pre className="text-sm text-red-600 whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </pre>
              
              {this.state.error?.stack && (
                <>
                  <h3 className="font-bold text-gray-800 mb-2 mt-4">Stack Trace:</h3>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                </>
              )}
              
              {this.state.errorInfo?.componentStack && (
                <>
                  <h3 className="font-bold text-gray-800 mb-2 mt-4">Component Stack:</h3>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-48">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ReactErrorBoundary;
