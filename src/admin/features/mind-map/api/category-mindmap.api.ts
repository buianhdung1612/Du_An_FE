import { apiApp } from "../../../shared/api/core";

export interface CategoryMindMap {
    _id: string;
    name: string;
    slug: string;
    parent: string;
    description: string;
    avatar: string;
    status: "active" | "inactive";
}

export const getCategoryMindMaps = async (params: any = {}) => {
    const res = await apiApp.get("/api/v1/admin/category-mindmap", { params });
    return res.data;
};

export const createCategoryMindMap = async (data: Partial<CategoryMindMap>) => {
    const res = await apiApp.post("/api/v1/admin/category-mindmap/create", data);
    return res.data;
};

export const editCategoryMindMap = async (id: string, data: Partial<CategoryMindMap>) => {
    const res = await apiApp.patch(`/api/v1/admin/category-mindmap/edit/${id}`, data);
    return res.data;
};

export const deleteCategoryMindMap = async (id: string, isForce: boolean = false) => {
    const url = isForce 
        ? `/api/v1/admin/category-mindmap/force-delete/${id}`
        : `/api/v1/admin/category-mindmap/delete/${id}`;
    
    if (isForce) {
        const res = await apiApp.delete(url);
        return res.data;
    } else {
        const res = await apiApp.patch(url);
        return res.data;
    }
};

export const restoreCategoryMindMap = async (id: string) => {
    const res = await apiApp.patch(`/api/v1/admin/category-mindmap/restore/${id}`);
    return res.data;
};
