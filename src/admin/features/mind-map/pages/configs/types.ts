export interface IMindMapCategory {
    _id: string;
    name: string;
    slug: string;
    parent?: string | null;
    description?: string;
    avatar?: string;
    status: 'active' | 'inactive';
    createdAt: Date | string;
    view?: number;
}

export interface ISelectOption {
    value: string;
    label: string;
}
