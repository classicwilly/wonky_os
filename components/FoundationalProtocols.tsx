
import React from 'react';
import ProtocolView from './ProtocolView';
import { SOP_DATA } from '../constants';

const FoundationalProtocols = () => {
  // Note: The original component had complex state management for editing.
  // This has been removed to align with the new, simpler ProtocolView.
  // Editing functionality can be managed globally or through a different mechanism if needed.
  const originalSop = SOP_DATA.find(s => s.id === '1');

  return (
    <ProtocolView
      sourceDocument="Foundational Protocols"
      title={originalSop?.title || 'Foundational Daily Protocols'}
      subtitle={originalSop?.description || 'The core 5 protocols required for system stability and daily function.'}
    />
  );
};

export default FoundationalProtocols;