

import React from 'react';
import ProtocolView from './ProtocolView';

const Manifesto = () => {
    return (
        <ProtocolView 
            sourceDocument="Manifesto"
            title="THE WONKY SPROUT OS"
            subtitle="Structure Engineered for Chaos"
            footer={
                <footer className="text-center mt-12 pt-8 border-t border-gray-700">
                    <p className="text-2xl font-bold text-accent-blue">"The Wonky Sprout: Structure Engineered for Chaos."</p>
                    <p className="mt-4">This is not a philosophy. This is not a journey. This is not inspiration.</p>
                    <p className="mt-2 text-xl font-bold">This is an engineering solution.</p>
                </footer>
            }
        />
    );
};

export default Manifesto;