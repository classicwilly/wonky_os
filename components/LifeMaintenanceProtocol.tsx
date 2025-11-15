
import React from 'react';
import ProtocolView from './ProtocolView';

const LifeMaintenanceProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Life Maintenance Protocol"
      title="LIFE MAINTENANCE PROTOCOL (SOP-LM)"
      subtitle="The unglamorous survival tasks that collapse when executive function fails: House cleaning, groceries, and personal hygiene."
      footer={
        <footer id="reminder" className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">These tasks do not define your worth. This SOP exists to remove shame and provide mechanical steps. Use it. Adapt it. Survive.</p>
        </footer>
      }
    />
  );
};

export default LifeMaintenanceProtocol;