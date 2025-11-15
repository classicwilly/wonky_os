

import { useState, useCallback } from 'react';
import { scanForPII } from '../utils/piiScanner.js';
import { useAIConsent } from './useAIConsent.js';

export function useAIPromptSafety() {
    const { checkConsentAndExecute, ...consentProps } = useAIConsent();
    const [isPiiModalOpen, setPiiModalOpen] = useState(false);
    const [piiMatches, setPiiMatches] = useState([]);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    const checkAndExecute = useCallback((prompt, action) => {
        const matches = scanForPII(prompt);
        if (matches.length > 0) {
            setPiiMatches(matches);
            // The action to perform if user clicks "Send Anyway"
            setActionToConfirm(() => () => checkConsentAndExecute(action)); 
            setPiiModalOpen(true);
        } else {
            // No PII, just do the regular consent check
            checkConsentAndExecute(action);
        }
    }, [checkConsentAndExecute]);

    const handlePiiConfirm = () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        setPiiModalOpen(false);
        setActionToConfirm(null);
    };

    const handlePiiCancel = () => {
        setPiiModalOpen(false);
        setActionToConfirm(null);
    };

    return {
        checkAndExecute,
        isPiiModalOpen,
        piiMatches,
        handlePiiConfirm,
        handlePiiCancel,
        ...consentProps // Pass through the consent modal props
    };
}