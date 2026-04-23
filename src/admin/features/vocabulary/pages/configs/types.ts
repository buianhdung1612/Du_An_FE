export interface IVocabularyTopic {
    _id: string;
    title: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface ISelectOption {
    value: string;
    label: string;
}
