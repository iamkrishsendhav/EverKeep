import api from "../lib/axios";


// ============================================================================
// ASSET SERVICE
// ============================================================================
//
// All asset-related API requests live here.
//
// Components should use these functions instead of calling axios directly.
//
// Authentication:
// JWT is automatically attached by the Axios interceptor.
// ============================================================================


// ============================================================================
// GET ALL ASSETS
// GET /api/assets
// ============================================================================

export const getAssets = async (params = {}) => {

    const response =
        await api.get("/assets", { params });

    return response.data;

};


// ============================================================================
// CREATE ASSET
// POST /api/assets
// ============================================================================

export const createAsset = async (
    assetData
) => {

    const response =
        await api.post(
            "/assets",
            assetData
        );

    return response.data;

};


// ============================================================================
// UPDATE ASSET
// PUT /api/assets/:id
// ============================================================================

export const updateAsset = async (
    id,
    assetData
) => {

    const response =
        await api.put(
            `/assets/${id}`,
            assetData
        );

    return response.data;

};


// ============================================================================
// DELETE ASSET
// DELETE /api/assets/:id
// ============================================================================

export const deleteAsset = async (
    id
) => {

    const response =
        await api.delete(
            `/assets/${id}`
        );

    return response.data;

};


// ============================================================================
// GET SINGLE ASSET
// GET /api/assets/:id
// ============================================================================
//
// Useful for asset detail/edit screens.
//
// ============================================================================

export const getAsset = async (
    id
) => {

    const response =
        await api.get(
            `/assets/${id}`
        );

    return response.data;

};

export const getAssetAccessDetails = async (id, { signal } = {}) => {
    const response = await api.get(`/assets/${encodeURIComponent(id)}/access`, { signal });
    return response.data?.data;
};
