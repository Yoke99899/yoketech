import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600">
          <h1 className="text-2xl font-bold">🚨 Terjadi Kesalahan</h1>
          <p className="mt-2">Silakan refresh halaman atau login ulang.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
