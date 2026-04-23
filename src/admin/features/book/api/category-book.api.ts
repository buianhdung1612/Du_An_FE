import { apiApp } from "../../../shared/api/core";

export interface CategoryBook {
    _id: string;
    name: string;
    slug: string;
    parent: string;
    description: string;
    avatar: string;
    status: "active" | "inactive";
}

export const getCategoryBooks = async (params: any = {}) => {
    const res = await apiApp.get("/api/v1/admin/category-book", { params });
    return res.data;
};

export const createCategoryBook = async (data: Partial<CategoryBook>) => {
    const res = await apiApp.post("/api/v1/admin/category-book/create", data);
    return res.data;
};

export const editCategoryBook = async (id: string, data: Partial<CategoryBook>) => {
    const res = await apiApp.patch(`/api/v1/admin/category-book/edit/${id}`, data);
    return res.data;
};

export const deleteCategoryBook = async (id: string, isForce: boolean = false) => {
    const url = isForce 
        ? `/api/v1/admin/category-book/force-delete/${id}`
        : `/api/v1/admin/category-book/delete/${id}`;
    
    if (isForce) {
        const res = await apiApp.delete(url);
        return res.data;
    } else {
        const res = await apiApp.patch(url);
        return res.data;
    }
};

export const restoreCategoryBook = async (id: string) => {
    const res = await apiApp.patch(`/api/v1/admin/category-book/restore/${id}`);
    return res.data;
};
