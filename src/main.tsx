import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
console.log("main.tsx: Script loading...");
const rootElement = document.getElementById('root');
if (rootElement) {
    console.log("main.tsx: Root element found");
} else {
    console.error("main.tsx: Root element NOT found!");
}

import { ErrorBoundary } from './components/ErrorBoundary'

console.log("main.tsx: Rendering started");
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
console.log("main.tsx: Rendering triggered");
