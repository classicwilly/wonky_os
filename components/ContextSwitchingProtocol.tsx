
import React from 'react';
import ProtocolView from './ProtocolView.js';

const ContextSwitchingProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Context Switching Protocol"
      title="CONTEXT SWITCHING RECOVERY PROTOCOL (IPI-CSR)"
      subtitle="Trigger: Forced context switch mid-task. Purpose: Capture cognitive state, handle interruption, and restore context with minimal cognitive load."
    />
  );
};

export default ContextSwitchingProtocol;
