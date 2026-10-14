import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { Check, Copy, WrapText } from 'lucide-react';
import { useMemo, useState } from 'react';

// Register supported languages scoped to PRD requirements
hljs.registerLanguage('php', php);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
    maxHeight?: string;
    onCopied?: () => void;
}

export default function CodeBlock({
    code,
    language = 'plaintext',
    className = '',
    maxHeight,
    onCopied,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const [wrap, setWrap] = useState(false);

    const highlightedCode = useMemo(() => {
        try {
            const lang = language.toLowerCase();
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        } catch {
            return code;
        }
    }, [code, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            onCopied?.();
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            onCopied?.();
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div
            className={`relative rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#121316] ${className}`}
        >
            {/* Action Bar Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 dark:border-zinc-800">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {language || 'code'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setWrap((prev) => !prev)}
                        title={wrap ? 'Nonaktifkan word-wrap' : 'Aktifkan word-wrap'}
                        className={`inline-flex min-h-[32px] items-center gap-1 rounded px-2 text-xs font-medium transition-colors ${
                            wrap
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                        }`}
                        aria-label="Toggle Word Wrap"
                    >
                        <WrapText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Wrap</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`inline-flex min-h-[32px] items-center gap-1.5 rounded px-2.5 text-xs font-semibold transition-colors duration-150 ${
                            copied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                        aria-label="Salin Kode"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Salin</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div
                className={`overflow-x-auto p-3.5 ${maxHeight ? `max-h-[${maxHeight}] overflow-y-auto` : ''}`}
            >
                <pre
                    className={`font-mono text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200 ${
                        wrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
                    }`}
                >
                    <code
                        className="hljs"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                </pre>
            </div>
        </div>
    );
}
