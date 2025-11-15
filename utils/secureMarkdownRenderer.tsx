
import React from 'react';

// A helper function that can be used inside .ts files (like hooks) that can't use JSX
const renderInline = (text) => {
    // Split text by bold markdown (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return React.createElement('strong', { key: index }, part.slice(2, -2));
        }
        return part;
    });
};

/**
 * A component for safely rendering a limited subset of markdown in .tsx files.
 * Replaces dangerouslySetInnerHTML.
 */
export const SecureMarkdown = ({ content }) => {
    // We use React.createElement to avoid JSX in case this file is misinterpreted.
    return React.createElement(React.Fragment, null, renderSecureMarkdown(content));
};

/**
 * A utility function for safely rendering a limited subset of markdown.
 * It returns an array of React.ReactNode, suitable for use in any context.
 * This function does NOT use JSX.
 * @param content The markdown string to parse.
 * @returns An array of React nodes.
 */
export function renderSecureMarkdown(content) {
    if (!content) return [];

    const lines = content.split('\n');
    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                React.createElement('ul', { key: `ul-${elements.length}`, className: "list-disc list-inside space-y-1 my-2" },
                    listItems.map((item, index) => (
                        React.createElement('li', { key: `li-${index}` }, renderInline(item))
                    ))
                )
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('## ')) {
            flushList();
            elements.push(React.createElement('h2', { key: index, className: "text-xl font-bold mt-4 mb-2 text-accent-teal" }, renderInline(line.substring(3))));
        } else if (line.startsWith('# ')) {
            flushList();
            elements.push(React.createElement('h1', { key: index, className: "text-2xl font-bold mt-4 mb-2" }, renderInline(line.substring(2))));
        } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            flushList(); // Flush previous list if starting a new one
            listItems.push(line.trim().substring(2));
        } else {
            flushList(); // A non-list item means any current list is finished
            if (line.trim()) {
                // Treat consecutive non-list lines as paragraphs
                elements.push(React.createElement('p', { key: index, className: "my-1" }, renderInline(line)));
            }
        }
    });

    flushList(); // Flush any remaining list items at the end of the content

    return elements;
}