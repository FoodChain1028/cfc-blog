import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ code, language, backgroundColor = "bg-zinc-800" }) => {
    const mermaidRef = useRef(null);
    const [mermaidSvg, setMermaidSvg] = useState('');
    const [mermaidError, setMermaidError] = useState('');
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    useEffect(() => {
        if (language === 'mermaid' && code) {
            const renderMermaid = async () => {
                try {
                    // Dynamic import to avoid SSR issues
                    const mermaid = (await import('mermaid')).default;

                    // Initialize mermaid
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'dark',
                        securityLevel: 'loose',
                        fontFamily: 'monospace',
                    });

                    // Generate unique ID
                    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                    // Render the diagram
                    const { svg } = await mermaid.render(id, code);
                    setMermaidSvg(svg);
                    setMermaidError('');
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    setMermaidError(`Error rendering diagram: ${error.message}`);
                    setMermaidSvg('');
                }
            };

            renderMermaid();
        }
    }, [code, language]);

    if (language === 'mermaid') {
        return (
            <div className={`my-8 ${backgroundColor} rounded-md overflow-x-auto relative`}>
                <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors z-10"
                    title="Copy code"
                >
                    {copied ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                    )}
                </button>
                <div className="p-4">
                    {mermaidError ? (
                        <pre className="text-red-400 text-sm">{mermaidError}</pre>
                    ) : mermaidSvg ? (
                        <div
                            className="mermaid-container text-center"
                            dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                        />
                    ) : (
                        <div className="text-gray-400 text-center">Rendering diagram...</div>
                    )}
                </div>
            </div>
        );
    }

    // Convert Tailwind class to CSS color
    const getBackgroundColor = (bgClass) => {
        const colorMap = {
            'bg-zinc-800': '#27272a',
            'bg-slate-800': '#1e293b',
            'bg-gray-900': '#111827',
            'bg-slate-900': '#0f172a',
            'bg-zinc-900': '#18181b',
        };
        return colorMap[bgClass] || '#27272a';
    };

    return (
        <div className={`my-8 ${backgroundColor} rounded-md overflow-x-auto relative`}>
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors z-10"
                title="Copy code"
            >
                {copied ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                )}
            </button>
            <div className="p-4">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        padding: 0,
                        borderRadius: 0,
                        fontSize: '0.875rem',
                        backgroundColor: 'transparent',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    lineNumberStyle={{
                        backgroundColor: 'transparent',
                        color: '#9ca3af',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                    }}
                    codeTagProps={{
                        style: {
                            backgroundColor: 'transparent !important',
                        }
                    }}
                    PreTag={({ children, ...props }) => (
                        <pre {...props} style={{ ...props.style, backgroundColor: 'transparent' }}>
                            {children}
                        </pre>
                    )}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock; 