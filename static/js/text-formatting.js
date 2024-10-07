function formatMarkdown(content) {
    const codeBlockRegex = /```(?:([\w#+-]+)?\n)?([\s\S]*?)```/g;
    let codeBlocks = [];

    // Extract code blocks and replace them with placeholders
    content = content.replace(codeBlockRegex, (match, lang, codeContent) => {
        const placeholder = `[[CODE_BLOCK_${codeBlocks.length}]]`;
        codeBlocks.push({ lang: lang || '', code: codeContent });
        return placeholder;
    });

    // Process markdown syntax outside code blocks
    // Headers
    content = content.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => {
        const level = hashes.length;
        return `<h${level}>${headingText}</h${level}>`;
    });

    // Bold and italic: **text**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong><em>$1</em></strong>');

    // Replace placeholders with code blocks
    content = content.replace(/\[\[CODE_BLOCK_(\d+)]]/g, (match, index) => {
        const { lang, code } = codeBlocks[index];
        const languageClass = lang ? `language-${lang.toLowerCase()}` : '';

        // Determine if the Run Code button should be included
        const isPython = lang && lang.toLowerCase() === 'python';
        const runButtonHTML = isPython ? `<button class="run-btn"><i class="fas fa-play"></i> Run Code</button>` : '';

        return `
            <div class="code-block">
                ${runButtonHTML}
                <button class="copy-btn">Copy</button>
                <pre><code class="${languageClass}">${escapeHtml(code.trim())}</code></pre>
                ${isPython ? `<div class="output"></div>` : ''}
            </div>
        `;
    });

    return content;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '`': '&#x60;',
        '=': '&#x3D;',
        '/': '&#x2F;',
    };
    return text.replace(/[&<>"'`=\/]/g, function(m) { return map[m]; });
}
