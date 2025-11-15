
import React from 'react';
import ProtocolView from './ProtocolView.js';

const MorningTransitionProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Morning Transition Protocol"
      title="MORNING TRANSITION PROTOCOL (MTP-SOP)"
      subtitle="Purpose: Bridge the gap between sleep and active execution through structured physical, mental, and environmental transitions."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The morning transition is where your day is won or lost. Run it every morning. No exceptions.</p>
        </footer>
      }
    />
  );
};

export default MorningTransitionProtocol;
