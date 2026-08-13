import mongoose from "mongoose";
import Warranty from "../models/Warranty.js";

/*
|--------------------------------------------------------------------------
| Helper: Validate MongoDB ObjectId
|--------------------------------------------------------------------------
*/

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/*
|--------------------------------------------------------------------------
| Helper: Calculate Warranty Status
|--------------------------------------------------------------------------
*/

const getWarrantyStatus = (expiryDate) => {
    if (!expiryDate) {
        return "Unknown";
    }

    const today = new Date();

    const expiry = new Date(expiryDate);

    const diffDays = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
        return "Expired";
    }

    if (diffDays <= 30) {
        return "Expiring Soon";
    }

    return "Active";
};

/*
|--------------------------------------------------------------------------
| Helper: Format Warranty Response
|--------------------------------------------------------------------------
*/

const formatWarranty = (warranty) => {
    const warrantyObject = warranty.toObject();

    return {
        ...warrantyObject,

        status: getWarrantyStatus(warranty.expiryDate),

        daysRemaining: Math.max(
            0,
            Math.ceil(
                (new Date(warranty.expiryDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
            )
        ),
    };
};

/*
|--------------------------------------------------------------------------
| Create Warranty
| POST /api/warranties
|--------------------------------------------------------------------------
*/

export const createWarranty = async (req, res) => {
    try {
        const {
            title,
            asset,
            provider,
            warrantyNumber,
            startDate,
            expiryDate,
            notes,
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Warranty title is required.",
            });
        }

        if (!startDate || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and expiry date are required.",
            });
        }

        if (new Date(expiryDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message:
                    "Expiry date cannot be before the start date.",
            });
        }

        if (asset && !isValidObjectId(asset)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
            });
        }

        const warranty = await Warranty.create({
            title: title.trim(),
            asset: asset || null,
            provider: provider?.trim() || "",
            warrantyNumber: warrantyNumber?.trim() || "",
            startDate,
            expiryDate,
            notes: notes?.trim() || "",
        });

        await warranty.populate("asset");

        return res.status(201).json({
            success: true,
            message: "Warranty created successfully.",
            data: formatWarranty(warranty),
        });
    } catch (error) {
        console.error("Create warranty error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create warranty.",
            error: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get All Warranties
| GET /api/warranties
|--------------------------------------------------------------------------
*/

export const getWarranties = async (req, res) => {
    try {
        const warranties = await Warranty.find()
            .populate("asset")
            .sort({
                expiryDate: 1,
                createdAt: -1,
            });

        const formattedWarranties = warranties.map(formatWarranty);

        return res.status(200).json({
            success: true,
            count: formattedWarranties.length,
            data: formattedWarranties,
        });
    } catch (error) {
        console.error("Get warranties error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch warranties.",
            error: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get Single Warranty
| GET /api/warranties/:id
|--------------------------------------------------------------------------
*/

export const getWarranty = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid warranty ID.",
            });
        }

        const warranty = await Warranty.findById(id).populate("asset");

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: formatWarranty(warranty),
        });
    } catch (error) {
        console.error("Get warranty error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch warranty.",
            error: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Update Warranty
| PUT /api/warranties/:id
|--------------------------------------------------------------------------
*/

export const updateWarranty = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid warranty ID.",
            });
        }

        const warranty = await Warranty.findById(id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found.",
            });
        }

        const {
            title,
            asset,
            provider,
            warrantyNumber,
            startDate,
            expiryDate,
            notes,
        } = req.body;

        const updatedStartDate =
            startDate || warranty.startDate;

        const updatedExpiryDate =
            expiryDate || warranty.expiryDate;

        if (new Date(updatedExpiryDate) < new Date(updatedStartDate)) {
            return res.status(400).json({
                success: false,
                message:
                    "Expiry date cannot be before the start date.",
            });
        }

        if (asset && !isValidObjectId(asset)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
            });
        }

        if (title !== undefined) {
            warranty.title = title.trim();
        }

        if (asset !== undefined) {
            warranty.asset = asset || null;
        }

        if (provider !== undefined) {
            warranty.provider = provider.trim();
        }

        if (warrantyNumber !== undefined) {
            warranty.warrantyNumber =
                warrantyNumber.trim();
        }

        if (startDate !== undefined) {
            warranty.startDate = startDate;
        }

        if (expiryDate !== undefined) {
            warranty.expiryDate = expiryDate;
        }

        if (notes !== undefined) {
            warranty.notes = notes.trim();
        }

        await warranty.save();

        await warranty.populate("asset");

        return res.status(200).json({
            success: true,
            message: "Warranty updated successfully.",
            data: formatWarranty(warranty),
        });
    } catch (error) {
        console.error("Update warranty error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update warranty.",
            error: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Delete Warranty
| DELETE /api/warranties/:id
|--------------------------------------------------------------------------
*/

export const deleteWarranty = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid warranty ID.",
            });
        }

        const warranty = await Warranty.findById(id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found.",
            });
        }

        await warranty.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Warranty deleted successfully.",
        });
    } catch (error) {
        console.error("Delete warranty error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete warranty.",
            error: error.message,
        });
    }
};