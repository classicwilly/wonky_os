
import React from 'react';
import GemCollector from '../../GemCollector.js';
import { useAppState } from '../../../contexts/AppStateContext.js';

const SebastianGemCollectorModule = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Sebastian" collectedGems={collectedGems.sebastian || []} />
    );
};

export default SebastianGemCollectorModule;