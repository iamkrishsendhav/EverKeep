import Asset from "../models/Asset.js";

// @desc    Create Asset
// @route   POST /api/assets
export const createAsset = async (req, res) => {
    try {
        const asset = await Asset.create(req.body);

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            data: asset,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get All Assets
// @route   GET /api/assets
export const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: assets.length,
            data: assets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get Single Asset
// @route   GET /api/assets/:id
export const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        res.status(200).json({
            success: true,
            data: asset,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update Asset
// @route   PUT /api/assets/:id
export const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset updated successfully",
            data: asset,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete Asset
// @route   DELETE /api/assets/:id
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        await asset.deleteOne();

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};