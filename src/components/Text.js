import React from "react";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }

  let content = text.reduce((acc, value) => {
    // Handle missing or malformed value structure
    if (!value || typeof value !== 'object') {
      return acc;
    }

    // Handle equation type (inline LaTeX)
    if (value.type === 'equation') {
      const equation = value.equation?.expression || '';
      acc.push(
        <React.Fragment key={`equation-${equation}`}>
          <InlineMath math={equation} />
        </React.Fragment>
      );
      return acc;
    }

    const annotations = value.annotations || {};
    const { bold, code, italic, strikethrough, underline } = annotations;
    const textContent = value.text || {};
    const plainText = value.plain_text || '';

    let el = textContent.link ? (
      <a key={plainText} href={textContent.link.url}>
        {plainText}
      </a>
    ) : (
      plainText
    );
    if (bold) {
      el = <strong key={`bold-${plainText}`}>{el}</strong>;
    }
    if (italic) {
      el = <em key={`italic-${plainText}`}>{el}</em>;
    }
    if (underline) {
      el = <u key={`underline-${plainText}`}>{el}</u>;
    }
    if (strikethrough) {
      el = <del key={`strikethrough-${plainText}`}>{el}</del>;
    }
    if (code) {
      el = (
        <code
          key={`code-${plainText}`}
          className="bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {el}
        </code>
      );
    }
    acc.push(
      <React.Fragment key={`fragment-${plainText}`}>{el}</React.Fragment>
    );
    return acc;
  }, []);

  return <>{content}</>;
};
