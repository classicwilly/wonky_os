
import React from 'react';
import ProtocolView from './ProtocolView';

const PixelFoldSetupSop = () => {
  return (
    <ProtocolView
      sourceDocument="Pixel Fold Setup SOP"
      title="PIXEL 9 PRO FOLD SETUP SOP (PFS-SOP)"
      subtitle="Configure the mobile extension of the Wonky Sprout OS for chaos capture, continuity, and emergency access."
      footer={
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The Pixel Fold is a tool, not a toy. It extends the Command Center into your pocket. Every setting serves the dual-mode life structure.</p>
        </footer>
      }
    />
  );
};

export default PixelFoldSetupSop;