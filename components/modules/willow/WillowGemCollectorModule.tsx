import React from 'react';
import GemCollector from '../../GemCollector.tsx'; // Adjusted path
import { useAppState } from '../../../contexts/AppStateContext.tsx'; // Adjusted path

const WillowGemCollectorModule: React.FC = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Willow" collectedGems={collectedGems.willow || []} />
    );
};

export default WillowGemCollectorModule;