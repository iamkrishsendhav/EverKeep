import { useState } from "react";
import { Copy, Check } from "lucide-react";

const isBlockStart = (line) => /^(#{1,6}\s|```|>\s?|[-*+]\s|\d+\.\s|\s*\|)/.test(line);

const safeHref = (value) => {
    try {
        const url = new URL(value);
        return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch {
        return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : null;
    }
};

function InlineMarkdown({ text }) {
    const tokens = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
    const output = [];
    let last = 0;
    let match;
    while ((match = tokens.exec(text))) {
        if (match.index > last) output.push(text.slice(last, match.index));
        if (match[1]) {
            const href = safeHref(match[2]);
            output.push(href ? <a key={match.index} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900">{match[1]}</a> : match[1]);
        } else if (match[3]) output.push(<strong key={match.index} className="font-semibold text-slate-900">{match[3]}</strong>);
        else if (match[4]) output.push(<code key={match.index} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800">{match[4]}</code>);
        else output.push(<em key={match.index}>{match[5]}</em>);
        last = tokens.lastIndex;
    }
    if (last < text.length) output.push(text.slice(last));
    return output;
}

function CodeBlock({ code, language }) {
    const [copied, setCopied] = useState(false);
    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };
    return <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[11px] text-slate-400"><span>{language || "Code"}</span><button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-label="Copy code block">{copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? "Copied" : "Copy code"}</button></div>
        <pre className="overflow-x-auto p-4 text-xs leading-6"><code>{code}</code></pre>
    </div>;
}

const tableCells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());

export default function MarkdownContent({ content = "" }) {
    const lines = String(content).split("\n");
    const blocks = [];
    let index = 0;
    while (index < lines.length) {
        const line = lines[index].trim();
        if (!line) { index += 1; continue; }

        if (line.startsWith("```")) {
            const language = line.slice(3).trim();
            const codeLines = [];
            index += 1;
            while (index < lines.length && !lines[index].trim().startsWith("```")) codeLines.push(lines[index++]);
            if (index < lines.length) index += 1;
            blocks.push(<CodeBlock key={`code-${index}`} code={codeLines.join("\n")} language={language}/>);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const Heading = `h${heading[1].length}`;
            blocks.push(<Heading key={`heading-${index}`} className="mb-2 mt-4 font-semibold tracking-tight text-slate-900 first:mt-0">{<InlineMarkdown text={heading[2]}/>}</Heading>);
            index += 1;
            continue;
        }

        if (line.startsWith("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
            const headers = tableCells(line);
            index += 2;
            const rows = [];
            while (index < lines.length && lines[index].trim().startsWith("|")) rows.push(tableCells(lines[index++]));
            blocks.push(<div key={`table-${index}`} className="my-3 max-w-full overflow-x-auto rounded-lg border border-slate-200"><table className="min-w-full border-collapse text-left text-xs"><thead className="bg-slate-50"><tr>{headers.map((cell, i) => <th key={i} className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800"><InlineMarkdown text={cell}/></th>)}</tr></thead><tbody>{rows.map((row, ri) => <tr key={ri} className="even:bg-slate-50/60">{headers.map((_, ci) => <td key={ci} className="border-b border-slate-100 px-3 py-2 align-top text-slate-700"><InlineMarkdown text={row[ci] || ""}/></td>)}</tr>)}</tbody></table></div>);
            continue;
        }

        if (/^[-*+]\s/.test(line)) {
            const items = [];
            while (index < lines.length && /^\s*[-*+]\s/.test(lines[index])) items.push(lines[index++].replace(/^\s*[-*+]\s+/, ""));
            blocks.push(<ul key={`ul-${index}`} className="my-2 list-disc space-y-1 pl-5 marker:text-slate-400">{items.map((item, i) => <li key={i}><InlineMarkdown text={item}/></li>)}</ul>);
            continue;
        }

        if (/^\d+\.\s/.test(line)) {
            const items = [];
            while (index < lines.length && /^\s*\d+\.\s/.test(lines[index])) items.push(lines[index++].replace(/^\s*\d+\.\s+/, ""));
            blocks.push(<ol key={`ol-${index}`} className="my-2 list-decimal space-y-1 pl-5 marker:font-medium marker:text-slate-500">{items.map((item, i) => <li key={i}><InlineMarkdown text={item}/></li>)}</ol>);
            continue;
        }

        if (line.startsWith(">")) {
            blocks.push(<blockquote key={`quote-${index}`} className="my-2 border-l-2 border-indigo-300 pl-3 text-slate-600"><InlineMarkdown text={line.replace(/^>\s?/, "")}/></blockquote>);
            index += 1;
            continue;
        }

        const paragraph = [line];
        index += 1;
        while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) paragraph.push(lines[index++].trim());
        blocks.push(<p key={`p-${index}`} className="my-2 whitespace-pre-wrap"><InlineMarkdown text={paragraph.join("\n")}/></p>);
    }
    return <div className="break-words">{blocks}</div>;
}
