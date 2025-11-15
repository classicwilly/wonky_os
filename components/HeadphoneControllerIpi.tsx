
import React from 'react';
import ProtocolView from './ProtocolView.js';

const HeadphoneControllerIpi = () => {
    return (
        <ProtocolView
            sourceDocument="Headphone Controller IPI"
            title='IPI: "Wonky Sprout" Headphone Controller'
            subtitle="A structured protocol to reverse engineer Soundcore headphone Bluetooth commands and build a desktop controller."
            footer={
                <footer className="text-center mt-12 pt-8 border-t border-gray-700">
                    <p className="text-xl font-bold text-accent-blue">This is the "fix," William. It is the ultimate "I fix stuff" project.</p>
                </footer>
            }
        />
    );
};

export default HeadphoneControllerIpi;
