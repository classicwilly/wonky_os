
import React from 'react';
import ProtocolView from './ProtocolView';

const SensoryOverloadProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Sensory Overload Protocol"
      title="SENSORY OVERLOAD EMERGENCY PROTOCOL (IPI-SO)"
      subtitle="Trigger: The environment has become unbearable. Purpose: Immediate actions to reduce sensory input and retreat to safety."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">Key principle: Retreat early. Recover fully. Prevent recurrence.</p>
        </footer>
      }
    />
  );
};

export default SensoryOverloadProtocol;