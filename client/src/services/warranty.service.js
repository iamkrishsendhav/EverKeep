import api from "../lib/axios";

/*
|--------------------------------------------------------------------------
| Warranty Service
|--------------------------------------------------------------------------
|
| Centralized API layer for warranty-related operations.
|
| Components and hooks should NOT call axios directly.
| All HTTP communication stays inside this file.
|
|--------------------------------------------------------------------------
*/


// ==========================================================================
// GET ALL WARRANTIES
// ==========================================================================

export const getWarranties = async () => {

    const response = await api.get(
        "/warranties"
    );

    return response.data;
};


// ==========================================================================
// GET SINGLE WARRANTY
// ==========================================================================

export const getWarranty = async (id) => {

    if (!id) {
        throw new Error(
            "Warranty ID is required."
        );
    }


    const response = await api.get(
        `/warranties/${id}`
    );

    return response.data;
};


// ==========================================================================
// CREATE WARRANTY
// ==========================================================================

export const createWarranty = async (
    warrantyData
) => {

    if (!warrantyData) {
        throw new Error(
            "Warranty data is required."
        );
    }


    const response = await api.post(
        "/warranties",
        warrantyData
    );

    return response.data;
};


// ==========================================================================
// UPDATE WARRANTY
// ==========================================================================

export const updateWarranty = async (
    id,
    warrantyData
) => {

    if (!id) {
        throw new Error(
            "Warranty ID is required."
        );
    }


    if (!warrantyData) {
        throw new Error(
            "Warranty data is required."
        );
    }


    const response = await api.put(
        `/warranties/${id}`,
        warrantyData
    );

    return response.data;
};


// ==========================================================================
// DELETE WARRANTY
// ==========================================================================

export const deleteWarranty = async (
    id
) => {

    if (!id) {
        throw new Error(
            "Warranty ID is required."
        );
    }


    const response = await api.delete(
        `/warranties/${id}`
    );

    return response.data;
};