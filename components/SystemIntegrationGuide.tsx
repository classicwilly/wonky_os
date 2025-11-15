
import React from 'react';
import ProtocolView from './ProtocolView.js';

const SystemIntegrationGuide = () => {
    return (
        <ProtocolView
            sourceDocument="System Integration Guide"
            title="System Integration: Google Workspace"
            subtitle="Operationalize your OS by integrating protocols with Google Workspace for enhanced system compliance and reduced executive dysfunction."
            footer={
                <footer className="mt-8 pt-6 border-t border-gray-700 max-w-4xl mx-auto">
                    <p className="text-sm text-text-light text-opacity-60 italic text-center">
                    Note: This implementation provides workflow guidance. Direct, automated integration with Google Workspace APIs (e.g., creating events from SOPs) requires a separate backend system for authentication and API calls, which is not part of this frontend-only application. Manual application is required.
                    </p>
                </footer>
            }
        />
    );
};

export default SystemIntegrationGuide;
