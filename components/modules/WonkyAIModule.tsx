
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ContentCard from '../ContentCard'; // Adjusted path
import { SecureMarkdown } from '../../utils/secureMarkdownRenderer';
import { useAIPromptSafety } from '../../hooks/useAIPromptSafety';
import AIConsentModal from '../AIConsentModal';
import PIIWarningModal from '../PIIWarningModal';

const WonkyAIModule = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();

    const systemInstruction = `You are "Wonky AI," an assistant for a neurodivergent systems diagnostician named William. Your core philosophy is "Structure Engineered for Chaos" and "Anti-BS." Your responses MUST be:
1.  **Direct and Unambiguous:** No fluff, no motivational platitudes ("You can do it!"). Use clear, concise language. State facts.
2.  **Structured:** Use numbered lists, checklists, or markdown tables. Break down complex problems into small, actionable micro-tasks. Use markdown for formatting lists and bolding.
3.  **System-Oriented:** Frame solutions as protocols, systems, or diagnostic procedures. Use engineering and systems-thinking metaphors.
4.  **Neurodivergent-Aware:** Acknowledge and account for executive dysfunction, sensory overload, and decision paralysis in your solutions. Provide the simplest possible first step.
5.  **Problem-Solving Focused:** Do not offer emotional support. Your job is to help the user diagnose the root cause of a problem and build a system to fix it.
Example Query: "I can't start cleaning my office."
Your Response Style:
"Acknowledged. Executive dysfunction triggered. Initiating 'Office Reset Protocol'.
**Diagnosis:** The task 'clean office' is too large and undefined, causing paralysis.
**Solution:** Reframe as a sequence of micro-tasks.
- Pick up ONE piece of trash off the floor.
- Put ONE item on your desk back where it belongs.
- Set a 5-minute timer.
Execute the first step now."
Your primary function is to be a tool that provides structure, not a coach that provides encouragement.`;

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty. Define the problem.");
            return;
        }
        setLoading(true);
        setError('');
        setResponse('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
            setResponse(result.text);
        } catch (e) {
            setError(`Error: ${e.message || 'Failed to communicate with the AI model.'}`);
            console.error(e);
        }
        setLoading(false);
    };
    
    const handleSubmit = () => {
        checkAndExecute(prompt, handleGenerate);
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit();
        }
    };

    return (
        <ContentCard title="🧠 Wonky AI Assistant">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-md min-h-[200px] max-h-[400px] border border-gray-700 mb-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
                            <p className="ml-3">Diagnosing...</p>
                        </div>
                    ) : error ? (
                         <div className="text-red-400 whitespace-pre-wrap"><p className="font-bold mb-2">System Error:</p>{error}</div>
                    ) : response ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <SecureMarkdown content={response} />
                        </div>
                    ) : (
                        <p className="text-text-light text-opacity-60 text-center flex items-center justify-center h-full">
                            Define a problem. Wonky AI will provide structure.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleEnterPress}
                        placeholder="Describe the chaos..."
                        className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {loading ? '...' : '✨ Ask AI'}
                    </button>
                </div>
            </div>
        </ContentCard>
    );
};

export default WonkyAIModule;