


import React, { useState, useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import { GoogleGenAI, Type } from "@google/genai";
import { useAIPromptSafety } from '../hooks/useAIPromptSafety.ts';
import AIConsentModal from './AIConsentModal.tsx';
import PIIWarningModal from './PIIWarningModal.tsx';
import AITrendAnalysis from './insights/AITrendAnalysis.tsx';
import HabitHeatmap from './insights/HabitHeatmap.tsx';
import ContentCard from './ContentCard.tsx';


const WeeklyReviewWizard = () => {
    const { appState, dispatch } = useAppState();
    const { tasks, brainDumpText, objectives, projects } = appState;
    const [step, setStep] = useState(1);

    // Step 2 State
    const [inboxesCleared, setInboxesCleared] = useState(false);

    // Step 4 State
    const [wins, setWins] = useState('');
    const [friction, setFriction] = useState('');
    const [focus, setFocus] = useState('');
    const [isAssisting, setIsAssisting] = useState(false);
    const [assistError, setAssistError] = useState('');

    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();

    const inboxCounts = useMemo(() => ({
        tasks: tasks.filter(t => t.status === 'todo' && !t.dueDate).length,
        brainDump: brainDumpText.trim() ? 1 : 0, // 1 if not empty, 0 if empty
    }), [tasks, brainDumpText]);

    const handleAssistReflection = async () => {
        setIsAssisting(true);
        setAssistError('');

        const prompt = `
            You are a systems analyst AI preparing a weekly review reflection for a neurodivergent user.
            Analyze the provided context from their week and generate a DRAFT for their reflection.
            The draft must be concise, analytical, and structured as a JSON object with three keys: "wins", "friction", and "focus".
            - "wins": A bulleted list of 2-3 clear successes.
            - "friction": A bulleted list of 2-3 challenges or points of failure.
            - "focus": A single, actionable sentence defining the primary goal for next week.

            Weekly Context:
            - Unprocessed Inbox Items: ${inboxCounts.tasks} tasks, ${inboxCounts.brainDump > 0 ? 'notes in brain dump' : 'empty brain dump'}.
            - Strategic Objectives: The user is tracking ${objectives.length} objectives and ${projects.length} projects.
            - AI Trend Analysis: Assume the user has reviewed the weekly trend analysis which may show correlations between habits, spending, and mood.
            
            Based on this, generate the reflection draft.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            wins: { type: Type.STRING, description: "Bulleted list of successes." },
                            friction: { type: Type.STRING, description: "Bulleted list of challenges." },
                            focus: { type: Type.STRING, description: "A single sentence for next week's focus." },
                        },
                    },
                }
            });

            const draft = JSON.parse(result.text);
            setWins(draft.wins || '');
            setFriction(draft.friction || '');
            setFocus(draft.focus || '');

        } catch (e) {
            setAssistError(`Failed to get assistance: ${e.message}`);
        } finally {
            setIsAssisting(false);
        }
    };
    
    const triggerAssist = () => {
        checkAndExecute( "Weekly review context data", handleAssistReflection);
    };

    const handleSaveReflection = () => {
        const reflectionContent = `## Weekly Review Reflection\n\n### ✅ Wins\n${wins}\n\n### ⚠️ Friction Points\n${friction}\n\n### 🎯 Next Week's Focus\n${focus}`;
        const date = new Date().toLocaleString();

        dispatch({
            type: 'ADD_KNOWLEDGE_ENTRY',
            payload: {
                title: `Weekly Review - ${date}`,
                content: reflectionContent,
                tags: ['weekly-review', 'reflection']
            }
        });

        // Reset state and move to a confirmation screen or back to the dashboard
        setWins(''); setFriction(''); setFocus(''); setInboxesCleared(false); setStep(5);
    };

    const ProgressBar = () => (
        <div className="flex justify-center items-center gap-2 my-8">
            {[1, 2, 3, 4].map(num => (
                <div key={num} className={`w-16 h-2 rounded-full transition-colors ${step >= num ? 'bg-accent-blue' : 'bg-gray-700'}`}></div>
            ))}
        </div>
    );
    
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <ContentCard title="Step 1: AI Trend Analysis">
                        <p className="text-gray-300 mb-4">Review the AI's analysis of your last 7 days to identify high-level patterns and correlations before diving into details.</p>
                        <AITrendAnalysis />
                        <button onClick={() => setStep(2)} className="w-full mt-6 p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">Proceed to Inbox Clearing</button>
                    </ContentCard>
                );
            case 2:
                return (
                    <ContentCard title="Step 2: Get to Inbox Zero">
                        <p className="text-gray-300 mb-4">Process all captured thoughts and tasks. A clear inbox is required for an effective review.</p>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-800 rounded-md flex justify-between items-center">
                                <span>Task Matrix Inbox Items:</span>
                                <span className="font-bold text-accent-teal">{inboxCounts.tasks}</span>
                            </div>
                             <div className="p-3 bg-gray-800 rounded-md flex justify-between items-center">
                                <span>Brain Dump Status:</span>
                                <span className="font-bold text-accent-teal">{inboxCounts.brainDump > 0 ? 'Contains Notes' : 'Empty'}</span>
                            </div>
                        </div>
                         <div className="mt-6">
                            <label className="flex items-center">
                                <input type="checkbox" checked={inboxesCleared} onChange={() => setInboxesCleared(!inboxesCleared)} className="h-5 w-5 rounded bg-gray-700 text-accent-blue focus:ring-accent-blue" />
                                <span className="ml-3 font-semibold">I confirm all inboxes are cleared.</span>
                            </label>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="p-3 bg-gray-600 font-bold rounded hover:bg-gray-500">Back</button>
                            <button onClick={() => setStep(3)} disabled={!inboxesCleared} className="p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600">Proceed to Progress Review</button>
                        </div>
                    </ContentCard>
                );
            case 3:
                 return (
                    <ContentCard title="Step 3: Review Progress">
                        <p className="text-gray-300 mb-4">Review your progress against strategic objectives and habit compliance.</p>
                        <div className="space-y-6">
                            <HabitHeatmap />
                             <div>
                                <h3 className="text-xl font-bold text-accent-blue mb-2">Strategic Objectives</h3>
                                {objectives.map(obj => (
                                    <div key={obj.id} className="mb-2 p-2 bg-gray-800 rounded">
                                        <p className="font-semibold">{obj.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(2)} className="p-3 bg-gray-600 font-bold rounded hover:bg-gray-500">Back</button>
                            <button onClick={() => setStep(4)} className="p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">Proceed to Reflection</button>
                        </div>
                    </ContentCard>
                );
            case 4:
                return (
                     <ContentCard title="Step 4: Guided Reflection & Planning">
                        {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
                        {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-300">Synthesize your review into actionable insights. Save this reflection to your Knowledge Vault.</p>
                             <button onClick={triggerAssist} disabled={isAssisting} className="px-4 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600 flex-shrink-0">
                                {isAssisting ? 'Assisting...' : '✨ Assist with Reflection'}
                            </button>
                        </div>
                        {assistError && <p className="text-red-400 text-sm mb-2">{assistError}</p>}
                        <div className="space-y-4">
                            <textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="✅ What went well this week? (Wins)" rows={4} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                            <textarea value={friction} onChange={e => setFriction(e.target.value)} placeholder="⚠️ What created friction or failed? (Friction Points)" rows={4} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                            <textarea value={focus} onChange={e => setFocus(e.target.value)} placeholder="🎯 What is the single most important focus for next week?" rows={2} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                        </div>
                         <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(3)} className="p-3 bg-gray-600 font-bold rounded hover:bg-gray-500">Back</button>
                            <button onClick={handleSaveReflection} disabled={!wins || !friction || !focus} className="p-3 bg-accent-green text-background-dark font-bold rounded hover:bg-green-500 disabled:bg-gray-600">Save Reflection to Vault</button>
                        </div>
                    </ContentCard>
                );
            case 5:
                 return (
                    <ContentCard title="Weekly Review Complete">
                        <div className="text-center p-8">
                            <span className="text-5xl mb-4">✅</span>
                            <h3 className="text-2xl font-bold text-accent-green">System Maintenance Complete</h3>
                            <p className="text-gray-300 mt-2">Your reflection has been saved to the Knowledge Vault. The system is calibrated for the week ahead.</p>
                            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'operations-control'})} className="mt-6 px-6 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                                Return to Dashboard
                            </button>
                        </div>
                    </ContentCard>
                );
            default: return null;
        }
    }

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Weekly Review Wizard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          A guided process to review, reflect, and plan.
        </p>
      </header>
      {step < 5 && <ProgressBar />}
      {renderStep()}
    </div>
  );
};

export default WeeklyReviewWizard;