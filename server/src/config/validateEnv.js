const isValidOrigin = (value) => {
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) && url.origin === value.replace(/\/$/, "");
    } catch {
        return false;
    }
};

export const validateEnvironment = (env = process.env) => {
    const errors = [];

    if (!env.MONGODB_URI?.trim()) errors.push("MONGODB_URI is required.");
    if (!env.JWT_SECRET?.trim()) errors.push("JWT_SECRET is required.");
    else if (env.JWT_SECRET.trim().length < 32) errors.push("JWT_SECRET must contain at least 32 characters.");

    if (env.NODE_ENV === "production") {
        if (!env.CLIENT_URL?.trim()) errors.push("CLIENT_URL must be configured in production.");
        if (env.JWT_SECRET && /^(secret|changeme|password|your[-_ ]?secret)/i.test(env.JWT_SECRET.trim())) {
            errors.push("JWT_SECRET must not use a known placeholder value.");
        }
    }

    if (env.CLIENT_URL?.trim()) {
        const origins = env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean);
        if (!origins.length || origins.some((origin) => !isValidOrigin(origin))) {
            errors.push("CLIENT_URL must contain valid HTTP(S) origins separated by commas.");
        }
    }

    const cloudinaryValues = [env.CLOUDINARY_CLOUD_NAME, env.CLOUDINARY_API_KEY, env.CLOUDINARY_API_SECRET];
    if (cloudinaryValues.some(Boolean) && !cloudinaryValues.every((value) => value?.trim())) {
        errors.push("Cloudinary configuration requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET together.");
    }

    const twilioAuthTokenPair = Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN);
    const twilioApiKeyPair = Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_API_KEY && env.TWILIO_API_SECRET);
    if ((env.TWILIO_AUTH_TOKEN || env.TWILIO_API_KEY || env.TWILIO_API_SECRET || env.TWILIO_ACCOUNT_SID) && !twilioAuthTokenPair && !twilioApiKeyPair) {
        errors.push("Twilio configuration requires TWILIO_ACCOUNT_SID with either TWILIO_AUTH_TOKEN or both TWILIO_API_KEY and TWILIO_API_SECRET.");
    }

    const trustProxyHops = env.TRUST_PROXY_HOPS;
    if (trustProxyHops !== undefined && (!/^\d+$/.test(trustProxyHops) || Number(trustProxyHops) > 10)) {
        errors.push("TRUST_PROXY_HOPS must be an integer between 0 and 10.");
    }

    if (errors.length) {
        const error = new Error(`Invalid server environment configuration: ${errors.join(" ")}`);
        error.code = "INVALID_ENVIRONMENT";
        throw error;
    }
};

export default validateEnvironment;
