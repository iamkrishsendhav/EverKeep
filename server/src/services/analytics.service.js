
import Asset from "../models/Asset.js";
import Warranty from "../models/Warranty.js";
import Subscription from "../models/subscription.model.js";

const getMonthlyAmount = (subscription) => {
    const amount = Number(subscription.amount);
    if (!Number.isFinite(amount) || amount < 0) return null;

    let normalized;
    switch (subscription.billingCycle) {
        case "weekly":
            normalized = (amount * 52) / 12;
            break;
        case "monthly":
            normalized = amount;
            break;
        case "quarterly":
            normalized = amount / 3;
            break;
        case "half-yearly":
            normalized = amount / 6;
            break;
        case "yearly":
            normalized = amount / 12;
            break;
        case "custom":
        default:
            return null;
    }
    return Number.isFinite(normalized) ? normalized : null;
};

const getDaysUntil = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

export const getAnalyticsOverview = async (userId) => {
    if (!userId) {
        const error = new Error("Authentication required.");
        error.statusCode = 401;
        throw error;
    }

    const [assets, warranties, subscriptions] = await Promise.all([
        Asset.find({ owner: userId })
            .select("name category purchasePrice status warrantyExpiry createdAt")
            .sort({ createdAt: -1 })
            .lean(),

        Warranty.find({ owner: userId })
            .select("title provider expiryDate")
            .sort({ expiryDate: 1 })
            .lean(),

        Subscription.find({ user: userId })
            .select("name provider category amount currency billingCycle startDate nextBillingDate status autoRenew")
            .sort({ nextBillingDate: 1 })
            .lean(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);
    in30Days.setHours(23, 59, 59, 999);

    const activeAssets = assets.filter(
        (asset) => asset.status === "Active",
    );

    const activeWarranties = warranties.filter(
        (warranty) => new Date(warranty.expiryDate) >= today,
    );

    const expiringWarranties = warranties.filter((warranty) => {
        if (!warranty.expiryDate) return false;

        const expiry = new Date(warranty.expiryDate);
        return !Number.isNaN(expiry.getTime()) && expiry >= today && expiry <= in30Days;
    });

    const activeSubscriptions = subscriptions.filter(
        (subscription) => subscription.status === "active",
    );

    // Do not add different currencies into one total.
    const monthlySpendByCurrency = {};

    activeSubscriptions.forEach((subscription) => {
        const amount = getMonthlyAmount(subscription);
        const currency = String(subscription.currency || "INR").trim().toUpperCase();
        if (amount === null || !/^[A-Z]{3}$/.test(currency)) return;
        monthlySpendByCurrency[currency] = (monthlySpendByCurrency[currency] || 0) + amount;
    });

    const unsupportedSubscriptionCount = activeSubscriptions.filter((subscription) => {
        const currency = String(subscription.currency || "INR").trim().toUpperCase();
        return getMonthlyAmount(subscription) === null || !/^[A-Z]{3}$/.test(currency);
    }).length;

    const assetCategoryMap = {};

    assets.forEach((asset) => {
        const category = asset.category || "Other";
        assetCategoryMap[category] =
            (assetCategoryMap[category] || 0) + 1;
    });

    const subscriptionCategoryMap = {};

    activeSubscriptions.forEach((subscription) => {
        const amount = getMonthlyAmount(subscription);
        const currency = String(subscription.currency || "INR").trim().toUpperCase();
        if (amount === null || !/^[A-Z]{3}$/.test(currency)) return;
        const category = subscription.category || "other";
        const key = `${currency}\u0000${category}`;
        subscriptionCategoryMap[key] = (subscriptionCategoryMap[key] || 0) + amount;
    });

    const upcomingRenewals = [
        ...warranties
            .filter((warranty) => {
                const days = getDaysUntil(warranty.expiryDate);
                return days !== null && days >= 0 && days <= 30;
            })
            .map((warranty) => ({
                id: String(warranty._id),
                name: warranty.title,
                provider: warranty.provider || "",
                type: "Warranty",
                date: warranty.expiryDate,
                daysRemaining: getDaysUntil(warranty.expiryDate),
            })),

        ...activeSubscriptions
            .filter((subscription) => {
                if (!subscription.nextBillingDate) return false;

                const days = getDaysUntil(subscription.nextBillingDate);
                return days !== null && days >= 0 && days <= 30;
            })
            .map((subscription) => ({
                id: String(subscription._id),
                name: subscription.name,
                provider: subscription.provider || "",
                type: "Subscription",
                date: subscription.nextBillingDate,
                daysRemaining: getDaysUntil(subscription.nextBillingDate),
                amount: subscription.amount,
                currency: subscription.currency || "INR",
            })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
        summary: {
            totalAssets: assets.length,
            activeAssets: activeAssets.length,
            totalAssetValue: assets.reduce(
                (total, asset) => total + (Number(asset.purchasePrice) || 0),
                0,
            ),
            totalWarranties: warranties.length,
            activeWarranties: activeWarranties.length,
            expiringWarranties: expiringWarranties.length,
            totalSubscriptions: subscriptions.length,
            activeSubscriptions: activeSubscriptions.length,
            monthlySpendByCurrency,
            unsupportedSubscriptionCount,
        },

        // These user-scoped source records support the existing Analytics
        // cards, charts, and date filters on the client.
        assets,
        warranties,
        subscriptions,

        assetCategories: Object.entries(assetCategoryMap).map(
            ([name, value]) => ({ name, value }),
        ),

        subscriptionCategories: Object.entries(subscriptionCategoryMap).map(
            ([key, value]) => {
                const [currency, name] = key.split("\u0000");
                return {
                name,
                currency,
                value: Number(value.toFixed(2)),
                };
            },
        ),

        upcomingRenewals: upcomingRenewals.slice(0, 10),

        recentAssets: assets.slice(0, 5).map((asset) => ({
            id: String(asset._id),
            name: asset.name,
            category: asset.category,
            status: asset.status,
            purchasePrice: asset.purchasePrice || 0,
            createdAt: asset.createdAt,
        })),
    };
};

export default { getAnalyticsOverview };
