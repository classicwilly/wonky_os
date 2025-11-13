import React, { useState } from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import OriginStory from './OriginStory';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA, ChecklistSectionData } from '../checklist-data.tsx';

const Manifesto: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'manifesto' | 'origin'>('manifesto');
    const manifestoData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Manifesto');

    const sections = manifestoData.map(s => ({ id: s.id, title: s.title }));

    const TabButton: React.FC<{
        tab: 'manifesto' | 'origin';
        label: string;
    }> = ({ tab, label }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${
                    isActive
                        ? 'border-accent-blue text-accent-blue'
                        : 'border-transparent text-text-light text-opacity-70 hover:text-white'
                }`}
                role="tab"
                aria-selected={isActive}
            >
                {label}
            </button>
        );
    };

    const renderSubSections = (subSections: ChecklistSectionData[] = []) => {
        return subSections.map(sub => (
            <React.Fragment key={sub.id}>
            {sub.title !== 'Hidden' && <h3 className="text-2xl font-semibold text-accent-teal mt-2 mb-2">{sub.title}</h3>}
            {sub.description && <div dangerouslySetInnerHTML={{ __html: sub.description }} />}
            {sub.items && 
                <ul className="list-none space-y-1 ml-4 mt-2">
                    {sub.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                </ul>
            }
            {sub.subSections && 
                <div className="grid md:grid-cols-2 gap-8 mt-4">
                    {renderSubSections(sub.subSections)}
                </div>
            }
            </React.Fragment>
        ));
    };

    return (
        <div>
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">THE WONKY SPROUT OS</h1>
                <p className="text-xl font-semibold text-accent-blue">Structure Engineered for Chaos</p>
            </header>

            <div className="mb-8 border-b border-gray-700 flex justify-center no-print">
                <TabButton tab="manifesto" label="The Manifesto" />
                <TabButton tab="origin" label="The Origin Story" />
            </div>

            {activeTab === 'manifesto' && (
                 <>
                    <QuickJump sections={sections} />
                    <div className="space-y-6 max-w-4xl mx-auto text-lg text-text-light text-opacity-90 leading-relaxed">
                        {manifestoData.map(section => (
                            <section key={section.id} id={section.id}>
                                <ContentCard title={section.title}>
                                {section.description && <div dangerouslySetInnerHTML={{ __html: section.description }} />}
                                {section.subSections && renderSubSections(section.subSections)}
                                </ContentCard>
                            </section>
                        ))}
                        
                        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
                            <p className="text-2xl font-bold text-accent-blue">"The Wonky Sprout: Structure Engineered for Chaos."</p>
                            <p className="mt-4">This is not a philosophy. This is not a journey. This is not inspiration.</p>
                            <p className="mt-2 text-xl font-bold">This is an engineering solution.</p>
                        </footer>
                    </div>
                 </>
            )}
            {activeTab === 'origin' && <OriginStory />}
        </div>
    );
};

export default Manifesto;