import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-[#030014] text-white min-h-screen font-mono">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            ⚠️ Application Crashed
                        </h1>
                        <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-red-900/50 mb-6">
                            <h2 className="text-xl font-bold text-red-400 mb-2">Error Message:</h2>
                            <pre className="whitespace-pre-wrap text-red-300 text-sm">
                                {this.state.error?.message}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <div className="bg-[#0a0a0f] p-6 rounded-2xl border border-white/10">
                                <h2 className="text-xl font-bold text-neutral-400 mb-2">Component Stack:</h2>
                                <pre className="whitespace-pre-wrap text-neutral-500 text-xs overflow-auto max-h-[500px]">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
