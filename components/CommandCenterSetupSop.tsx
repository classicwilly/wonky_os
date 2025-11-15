
import React from 'react';
import ProtocolView from './ProtocolView.js';

const CommandCenterSetupSop = () => {
  return (
    <ProtocolView
      sourceDocument="Command Center Setup SOP"
      title="COMMAND CENTER SETUP SOP (CCS-SOP)"
      subtitle="Define the complete equipment, software, and spatial requirements for the neurodivergent-optimized Command Center."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The Command Center is not about having the best gear. It's about eliminating every friction point between your brain and your output.</p>
        </footer>
      }
    />
  );
};

export default CommandCenterSetupSop;
