import React from 'react';
import GemCollector from '../../GemCollector.tsx';
import { useAppState } from '../../../contexts/AppStateContext.tsx';

const SebastianGemCollectorModule: React.FC = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Sebastian" collectedGems={collectedGems.sebastian || []} />
    );
};

export default SebastianGemCollectorModule;