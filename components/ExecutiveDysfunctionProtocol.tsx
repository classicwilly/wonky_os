
import React from 'react';
import ProtocolView from './ProtocolView.js';

const ExecutiveDysfunctionProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Executive Dysfunction Protocol"
      title="EXECUTIVE DYSFUNCTION EMERGENCY PROTOCOL (IPI-ED)"
      subtitle="Trigger: Everything feels impossible. You are frozen. Purpose: An emergency reboot to restore basic operational capacity."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The freeze is not a moral failure. It's a systems failure. This protocol is the emergency fix. Now execute it.</p>
        </footer>
      }
    />
  );
};

export default ExecutiveDysfunctionProtocol;
