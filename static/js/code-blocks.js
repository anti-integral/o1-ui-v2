// Initialize Pyodide
let pyodideReadyPromise = null;

async function loadPyodideAndPackages() {
    if (!pyodideReadyPromise) {
        pyodideReadyPromise = loadPyodide();
    }
    return pyodideReadyPromise;
}

function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        if (!button.dataset.listenerAdded) {
            button.dataset.listenerAdded = 'true';
            button.onclick = () => {
                const codeBlock = button.nextElementSibling.querySelector('code');
                const codeText = codeBlock.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    // Provide feedback
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            };
        }
    });

    // Setup run buttons for Python code blocks
    const runButtons = document.querySelectorAll('.run-btn');
    runButtons.forEach(button => {
        if (!button.dataset.listenerAdded) {
            button.dataset.listenerAdded = 'true';
            button.onclick = async () => {
                const codeBlock = button.nextElementSibling.nextElementSibling.querySelector('code');
                const codeText = codeBlock.textContent;
                const outputDiv = button.parentElement.querySelector('.output');

                console.log('Running code:', codeText);

                // Show loading indicator
                outputDiv.innerHTML = '<pre>Running...</pre>';

                try {
                    // Load Pyodide if not already loaded
                    const pyodide = await loadPyodideAndPackages();

                    // Capture stdout and stderr
                    let output = '';
                    let errorOutput = '';

                    function captureOutput(text) {
                        output += text;
                    }

                    function captureError(text) {
                        errorOutput += text;
                    }

                    // Redirect stdout and stderr
                    pyodide.setStdout({ batched: captureOutput });
                    pyodide.setStderr({ batched: captureError });

                    // Run the code
                    await pyodide.runPythonAsync(codeText);

                    // Reset stdout and stderr
                    pyodide.setStdout();
                    pyodide.setStderr();

                    // Combine outputs
                    let totalOutput = output + errorOutput;

                    console.log('Raw Output:', totalOutput);

                    // Process escaped characters
                    totalOutput = processEscapedCharacters(totalOutput);

                    console.log('Processed Output:', totalOutput);

                    // Display the output using textContent
                    outputDiv.innerHTML = '<pre></pre>';
                    outputDiv.querySelector('pre').textContent = totalOutput || 'No output';
                } catch (error) {
                    console.error('Error:', error);
                    // Display the error using textContent
                    outputDiv.innerHTML = '<pre style="color: red;"></pre>';
                    outputDiv.querySelector('pre').textContent = error.message;
                }
            };
        }
    });
}

function processEscapedCharacters(text) {
    try {
        // Encapsulate the text in double quotes and parse it
        return JSON.parse(`"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
    } catch (e) {
        console.error('Error processing escaped characters:', e);
        return text;
    }
}
