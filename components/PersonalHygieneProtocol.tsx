
import React from 'react';
import ProtocolView from './ProtocolView.js';

const PersonalHygieneProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Personal Hygiene Protocol"
      title="PERSONAL HYGIENE PROTOCOL (SOP-PH)"
      subtitle="A tiered hygiene system for neurodivergent brains. Match hygiene to your capacity."
      footer={
        <footer id="reminder" className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">Your hygiene is not your worth. Skipped shower ≠ bad person. This protocol exists to remove shame and provide structure. Use it. Adapt it. Survive.</p>
        </footer>
      }
    />
  );
};

export default PersonalHygieneProtocol;
