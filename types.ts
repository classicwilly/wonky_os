
export interface ChecklistItemData {
    id: string;
    label: string;
    gemAwardId?: string;
    gemRecipient?: 'willow' | 'sebastian';
    achievementAwardId?: string;
    large?: boolean;
    time?: string;
    startHour?: number;
    endHour?: number;
}

export interface ChecklistSectionData {
    id: string;
    title: string;
    sourceDocument: string;
    description?: string;
    items?: ChecklistItemData[];
    subSections?: ChecklistSectionData[];
}

export interface ChildProfile {
    allergies: string;
    medications: string;
    emergencyContacts: string;
    schoolInfo: string;
}

export type ExpenseCategory = 'Housing' | 'Utilities' | 'Groceries' | 'Transport' | 'Health' | 'Kids' | 'Personal' | 'Other' | 'School';
