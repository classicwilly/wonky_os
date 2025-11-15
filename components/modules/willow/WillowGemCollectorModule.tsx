
import React from 'react';
import GemCollector from '../../GemCollector.js'; // Adjusted path
import { useAppState } from '../../../contexts/AppStateContext.js'; // Adjusted path

const WillowGemCollectorModule = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Willow" collectedGems={collectedGems.willow || []} />
    );
};

export default WillowGemCollectorModule;