


import React from 'react';
import { useAppState } from '../../contexts/AppStateContext.js';
import ContentCard from '../ContentCard.js';
import { REWARD_TIERS } from '../../constants.js';

const RewardStoreModule = () => {
    const { appState, dispatch } = useAppState();
    const { dashboardType, collectedGems, redeemedRewards, acknowledgedRedemptions } = appState;

    if (dashboardType !== 'willow' && dashboardType !== 'sebastian') {
        return null; // This module is only for kids' dashboards
    }

    const personaGems = collectedGems[dashboardType].length;
    const personaRedeemed = redeemedRewards[dashboardType] || [];
    const personaAcknowledged = acknowledgedRedemptions[dashboardType] || [];


    const handleRedeem = (threshold) => {
        dispatch({ type: 'REDEEM_REWARD', payload: { persona: dashboardType, threshold } });
    };

    return (
        <ContentCard title="🎁 Reward Store">
            <p className="text-sm text-text-light text-opacity-80 mb-4">
                Use your collected gems to redeem awesome rewards!
            </p>
            <div className="space-y-3">
                {REWARD_TIERS.map(tier => {
                    const isUnlocked = personaGems >= tier.threshold;
                    const isRedeemed = personaRedeemed.includes(tier.threshold);
                    const isAcknowledged = personaAcknowledged.includes(tier.threshold);

                    let button;
                    if (isAcknowledged) {
                        button = <button disabled className="px-4 py-2 text-sm font-semibold rounded bg-accent-green text-background-dark cursor-not-allowed">✓ Fulfilled!</button>;
                    } else if (isRedeemed) {
                        button = <button disabled className="px-4 py-2 text-sm font-semibold rounded bg-accent-warning text-background-dark cursor-not-allowed animate-pulse">Pending...</button>;
                    } else if (isUnlocked) {
                        button = <button onClick={() => handleRedeem(tier.threshold)} className="px-4 py-2 text-sm font-semibold rounded bg-accent-blue text-background-dark hover:bg-blue-400 transition-colors">Redeem</button>;
                    } else {
                        button = <button disabled className="px-4 py-2 text-sm font-semibold rounded bg-gray-800 text-gray-500 border border-gray-600 cursor-not-allowed">Locked</button>;
                    }

                    return (
                        <div key={tier.threshold} className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${isAcknowledged ? 'bg-accent-green/20 border border-accent-green/50' : !isUnlocked ? 'opacity-50' : 'bg-card-dark'}`}>
                            <div className="flex items-center">
                                <span className="text-3xl mr-4">{tier.emoji}</span>
                                <div>
                                    <h4 className="font-bold text-accent-teal">{tier.title}</h4>
                                    <p className="text-xs text-gray-400">Requires {tier.threshold} gems</p>
                                </div>
                            </div>
                            {button}
                        </div>
                    );
                })}
            </div>
        </ContentCard>
    );
};

export default RewardStoreModule;