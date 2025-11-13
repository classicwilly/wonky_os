import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext.tsx';
import ContentCard from './ContentCard.tsx';
import { GoogleGenAI } from '@google/genai'; // Required for API key context

// window.aistudio is assumed to be pre-configured, valid, and accessible in the execution context
// as per the coding guidelines. Explicitly declaring it here causes a "duplicate declaration" error.
// The external environment (AI Studio) provides this global object.

const WonkyAISetupGuide: React.FC = () => {
  const { dispatch } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keySelectionAttempted, setKeySelectionAttempted] = useState(false);

  // Check API key selection status on mount
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      // Ensure window.aistudio and its methods exist before calling them, as per guidelines.
      // The type for window.aistudio is assumed to be available globally from the environment.
      if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey && !keySelectionAttempted) {
            // If a key is already selected and we haven't tried to select one, assume successful setup.
            dispatch({ type: 'SET_INITIAL_SETUP_COMPLETE', payload: true });
            dispatch({ type: 'SET_PERSONA', payload: 'william' });
          }
        } catch (e: any) {
          setError(`API Key check failed: ${e.message}. Please try again.`);
          console.error('Error checking API key status:', e);
        }
      } else {
        // This indicates a critical environment setup issue.
        setError("`window.aistudio` is not available. API key management functions are missing.");
      }
    };

    checkApiKeyStatus();
  }, [dispatch, keySelectionAttempted]);


  const handleGetStarted = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure window.aistudio and its methods exist before calling them.
      if (typeof window.aistudio?.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setKeySelectionAttempted(true); // Mark that we've tried to open the dialog

        // Due to potential race conditions, assume success after `openSelectKey` is called.
        // The actual API key value will be injected into process.env.API_KEY by the environment.
        dispatch({ type: 'SET_INITIAL_SETUP_COMPLETE', payload: true });
        dispatch({ type: 'SET_PERSONA', payload: 'william' }); // Default to William's dashboard
      } else {
        // This indicates a critical environment setup issue.
        setError("`window.aistudio.openSelectKey` is not available. Cannot select API key.");
      }
    } catch (e: any) {
        // If 'Requested entity was not found.' is received, it means the key might be invalid or deleted.
        // Prompt user to select a key again.
        if (e.message && e.message.includes("Requested entity was not found.")) {
            setError("Selected API key is invalid or not found. Please select a valid key.");
            // Do not mark setup complete, allow retrying key selection.
            setKeySelectionAttempted(false); 
        } else {
            setError(`Error opening API Key selector: ${e.message || 'Unknown error'}`);
        }
        console.error('Error opening API key selector:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <ContentCard title="Welcome to Wonky Sprout OS" titleClassName="text-accent-teal text-4xl">
        <p className="text-lg text-text-light text-opacity-80 mb-6">
          To begin, you must select an API key to enable powerful AI features within the OS. This is a mandatory step.
          Without a valid key, AI functionalities will be unavailable.
        </p>

        {error && (
          <div role="alert" className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-md mb-6">
            <p className="font-bold mb-2">System Error:</p>
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleGetStarted}
          disabled={loading}
          className="w-full px-8 py-4 bg-accent-blue text-background-dark text-xl font-bold rounded-md hover:bg-blue-400 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Get Started with Wonky Sprout OS and Select API Key"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Opening Key Selector...
            </span>
          ) : (
            'Get Started: Select API Key'
          )}
        </button>

        <p className="text-sm text-text-light text-opacity-70 mt-6 text-center">
          For more information on billing and API keys, please visit:{" "}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline"
          >
            ai.google.dev/gemini-api/docs/billing
          </a>
        </p>
      </ContentCard>
    </div>
  );
};

export default WonkyAISetupGuide;