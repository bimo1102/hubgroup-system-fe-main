import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import App from './app';

const bootstrapApplication = () => {
    const element: HTMLDivElement = document.querySelector<HTMLDivElement>('#root');
    if (!element) return;
    const root: Root = createRoot(element);
    root.render(<App />);
};

bootstrapApplication();
