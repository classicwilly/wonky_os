
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ContentCard from '../../ContentCard.js'; // Adjusted path
import { SecureMarkdown } from '../../../utils/secureMarkdownRenderer.js';
import { useAIPromptSafety } from '../../../hooks/useAIPromptSafety.js';
import AIConsentModal from '../../AIConsentModal.js';
import PIIWarningModal from '../../PIIWarningModal.js';

const AICommunicationCoachModule = () => {
    const [mode, setMode] = useState('translate');
    
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [incomingText, setIncomingText] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [draftedReply, setDraftedReply] = useState('');

    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();
    
    useEffect(() => {
        setError('');
        setAnalysisError('');
    }, [mode, originalText, incomingText]);

    const handleTranslate = async () => {
        if (!originalText.trim()) {
            setError("Input message cannot be empty. Define the communication objective.");
            return;
        }
        setLoading(true);
        setError('');
        setTranslatedText('');

        const systemInstruction = `You are an expert communication coach specializing in translating direct, neurodivergent communication styles (like Autism/ADHD) into language that is clear, collaborative, and less likely to be misinterpreted by a neurotypical co-parent. Your goal is to preserve the core facts and intent of the message while rephrasing it to be constructive and low-conflict.

    **Core Directives:**
    1.  **Preserve Facts:** The essential information (who, what, where, when, why) must remain unchanged.
    2.  **Remove Bluntness:** Replace declarative, demand-like statements with collaborative suggestions or questions.
    3.  **Add 'I' Statements:** Reframe accusations or frustrations into statements about personal feelings or observations (e.g., "You're always late" becomes "I feel stressed when pickup times are missed because it disrupts our evening schedule.").
    4.  **Inject Collaboration:** Use phrases like "How can we work together on this?", "What are your thoughts on...?", or "Would it be possible to...".
    5.  **Assume Good Intent:** Frame the translated message as if the user and co-parent are a team solving a logistical problem for the benefit of their children.
    6.  **Keep it Concise:** Do not add excessive fluff. The goal is clarity and reduced conflict, not a corporate email.

    **Example Translation:**
    -   **Original:** "Bash's soccer cleats don't fit. You need to buy him new ones before Friday's game."
    -   **Translated:** "Hey, I noticed Bash's soccer cleats seem too small for him. With the game on Friday, could we coordinate on getting him a new pair? Let me know what works best for you."`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: originalText,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
            setTranslatedText(result.text);
        } catch (e) {
            setError(`Error: ${e.message || 'Failed to communicate with the AI model.'}`);
            console.error(e);
        }
        setLoading(false);
    };

    const handleAnalyze = async () => {
        if (!incomingText.trim()) {
            setAnalysisError("Incoming message cannot be empty.");
            return;
        }
        setAnalysisLoading(true);
        setAnalysisError('');
        setAnalysisResult('');
        setDraftedReply('');

        const systemInstruction = `You are an expert communication coach specializing in de-escalating co-parenting conflicts. You analyze incoming messages for a neurodivergent user who needs help separating emotional subtext from factual information. Your goal is to help the user understand the message without reacting emotionally, so they can reply according to their low-conflict communication protocol.

**Core Directives:**
1.  **Identify Core Facts:** Extract the essential, objective information (who, what, when, where). What is the logistical request?
2.  **Detect Potential Emotions:** Cautiously identify potential underlying emotions in the message (e.g., "The phrasing 'as usual' might suggest frustration."). Use neutral, non-judgmental language.
3.  **Filter Out 'Noise':** Identify parts of the message that are emotional, accusatory, or not constructive (e.g., sarcasm, blame).
4.  **Suggest a Focus:** Advise the user on what to focus their reply on (always the logistical, child-focused part) and what to ignore (the emotional 'noise').
5.  **Output Structure:** Provide your analysis in a clear markdown format with these exact headings: "## Core Facts", "## Potential Emotional Subtext", and "## Suggested Focus for Reply".`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the following message: "${incomingText}"`,
                config: { systemInstruction }
            });
            setAnalysisResult(result.text);
        } catch(e) {
            setAnalysisError(`Error: ${e.message || 'Failed to analyze the message.'}`);
            console.error(e);
        }
        setAnalysisLoading(false);
    }

    const handleDraftReply = async () => {
        if (!incomingText || !analysisResult) {
            setAnalysisError("Cannot draft a reply without an original message and its analysis.");
            return;
        }
        setAnalysisLoading(true);
        setAnalysisError('');
    
        const systemInstruction = `You are an expert communication coach drafting a reply for a neurodivergent user in a high-conflict co-parenting situation. Your goal is to create a safe, boring, and de-escalating response.
    
    **Your Task:**
    Based on the provided "Original Message" and its "Analysis", draft a reply that STRICTLY adheres to the following protocol:
    1.  **Address ONLY the Core Facts:** Your reply must only address the logistical, factual points identified in the analysis.
    2.  **IGNORE Emotional Subtext:** Completely ignore any sarcasm, blame, or emotional language from the original message. Do not acknowledge, apologize for, or defend against it. This is critical.
    3.  **Apply the BIFF Model:**
        -   **Brief:** 2-4 sentences maximum.
        -   **Informative:** State only objective facts.
        -   **Friendly:** Use a neutral, polite tone (e.g., "Thanks for the update," "Hope you have a good week").
        -   **Firm:** End the conversation. Do not ask open-ended questions that invite debate. Provide a clear statement or a yes/no question if a decision is needed.
    
    **Input Data:**
    -   **Original Message Received:** "${incomingText}"
    -   **AI Analysis of Message:** "${analysisResult}"
    
    **Example:**
    -   **Original Message:** "I can't believe you forgot to pack Willow's jacket again. I guess I'll have to buy her another one since you can't seem to remember anything. I'll be late for pickup tomorrow because of an appointment I can't move."
    -   **Analysis:** Facts: Willow needs a jacket. Co-parent will be late for pickup tomorrow. Emotion: Frustration, blame.
    -   **Your Drafted Reply:** "Thanks for letting me know about pickup tomorrow. I've noted you'll be late. I'll make sure Willow has her jacket for the next handoff."
    
    Now, generate the draft reply based on the provided input data.`;
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Draft a reply.`,
                config: { systemInstruction }
            });
            
            setDraftedReply(result.text);
    
        } catch (e) {
            setAnalysisError(`Drafting Error: ${e.message || 'Failed to draft a reply.'}`);
            console.error(e);
        }
        setAnalysisLoading(false);
    };
    
    const handleCopy = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy);
    };
    
    const TabButton = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors w-1/2 ${
                isActive
                    ? 'bg-card-dark border-b-2 border-accent-blue text-accent-blue'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            role="tab"
            aria-selected={isActive}
        >
            {label}
        </button>
    );

    return (
        <ContentCard title="🤖 AI Communication Coach" titleClassName="text-accent-blue text-xl">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <div className="flex border-b border-gray-700" role="tablist">
                <TabButton label="Translate Your Message" isActive={mode === 'translate'} onClick={() => setMode('translate')} />
                <TabButton label="Analyze Incoming Message" isActive={mode === 'analyze'} onClick={() => setMode('analyze')} />
            </div>
            
            <div className="pt-4">
                {mode === 'translate' && (
                    <div role="tabpanel">
                        <p className="text-md text-text-light text-opacity-80 mb-4">
                            Write your direct, factual message below. The AI will translate it into a collaborative, low-conflict format for your co-parent.
                        </p>
                        {error && (
                          <div role="alert" className="bg-red-800 bg-opacity-30 border border-red-700 text-red-400 p-3 rounded-md mb-4 text-sm">
                            <p className="font-semibold">System Error:</p>
                            <p>{error}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="original-text" className="font-semibold text-accent-teal">Your Direct Message:</label>
                                <textarea
                                    id="original-text"
                                    value={originalText}
                                    onChange={(e) => setOriginalText(e.target.value)}
                                    rows={6}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                    placeholder="e.g., Willow's dentist appointment is Tuesday at 3pm. You have to take her."
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="translated-text" className="font-semibold text-accent-green">Translated Message:</label>
                                <textarea
                                    id="translated-text"
                                    value={loading ? "Translating..." : translatedText}
                                    readOnly
                                    rows={6}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-text-light placeholder-gray-500"
                                    placeholder="Translation will appear here..."
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end items-center space-x-4">
                             {translatedText && !loading && (
                                <button onClick={() => handleCopy(translatedText)} className="px-4 py-2 bg-gray-600 text-text-light rounded-md hover:bg-gray-500 transition-colors font-semibold">Copy</button>
                             )}
                             <button
                                onClick={() => checkAndExecute(originalText, handleTranslate)}
                                disabled={loading}
                                className="px-6 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {loading ? '...' : '✨ Translate'}
                            </button>
                        </div>
                    </div>
                )}
                {mode === 'analyze' && (
                    <div role="tabpanel">
                        <p className="text-md text-text-light text-opacity-80 mb-4">
                            Paste a message from your co-parent to deconstruct it into facts and identify emotional subtext.
                        </p>
                        <div className="space-y-2 mb-4">
                            <label htmlFor="incoming-text" className="font-semibold text-accent-teal">Incoming Message:</label>
                            <textarea
                                id="incoming-text"
                                value={incomingText}
                                onChange={(e) => setIncomingText(e.target.value)}
                                rows={4}
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                placeholder="Paste the message you received here..."
                                disabled={analysisLoading}
                            />
                        </div>
                        <button
                            onClick={() => checkAndExecute(incomingText, handleAnalyze)}
                            disabled={analysisLoading}
                            className="w-full px-6 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {analysisLoading && !analysisResult ? 'Analyzing...' : '✨ Analyze Message'}
                        </button>
                        
                        {analysisError && (
                          <div role="alert" className="mt-4 bg-red-800 bg-opacity-30 border border-red-700 text-red-400 p-3 rounded-md text-sm">
                            <p className="font-semibold">System Error:</p>
                            <p>{analysisError}</p>
                          </div>
                        )}

                        {(analysisResult || (analysisLoading && !draftedReply)) && (
                            <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-md min-h-[150px]">
                                <h3 className="font-semibold text-accent-green mb-2">Analysis Report:</h3>
                                {analysisLoading && !analysisResult ? (
                                     <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-blue"></div>
                                        <p className="ml-3 text-sm">Processing...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <SecureMarkdown content={analysisResult} />
                                    </div>
                                )}
                            </div>
                        )}

                        {analysisResult && !analysisLoading && !draftedReply && (
                            <button
                                onClick={() => checkAndExecute(incomingText, handleDraftReply)}
                                disabled={analysisLoading}
                                className="mt-4 w-full px-6 py-2 bg-accent-green text-background-dark rounded-md hover:bg-green-500 transition-colors duration-200 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {analysisLoading ? 'Drafting...' : '✨ Draft Protocol-Compliant Reply'}
                            </button>
                        )}

                        {draftedReply && !analysisLoading && (
                            <div className="mt-4 space-y-2">
                                <label htmlFor="drafted-reply-text" className="font-semibold text-accent-green">Drafted Reply:</label>
                                <textarea
                                    id="drafted-reply-text"
                                    value={draftedReply}
                                    onChange={(e) => setDraftedReply(e.target.value)}
                                    rows={5}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-text-light placeholder-gray-500"
                                />
                                <div className="flex justify-end">
                                    <button onClick={() => handleCopy(draftedReply)} className="px-4 py-2 bg-gray-600 text-text-light rounded-md hover:bg-gray-500 transition-colors font-semibold">Copy</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ContentCard>
    );
};

export default AICommunicationCoachModule;