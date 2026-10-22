import { useEffect, useState } from "react";
import notificationService from "../../services/notification.service.js";

const CATEGORIES = ["warranty", "subscription", "asset", "document", "family", "calendar", "system"];
const DEFAULT_PREFERENCES = { emailEnabled: false, emailCategories: [], whatsappEnabled: false, whatsappCategories: [] };
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

export default function NotificationPreferences() {
    const [settings, setSettings] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let active = true;
        notificationService.getNotificationPreferences()
            .then((response) => {
                if (!active) return;
                setSettings(response.data);
                setPhoneNumber(response.data.phoneNumber || "");
                setConsent(Boolean(response.data.preferences?.whatsappConsentAt));
            })
            .catch((cause) => { if (active) setError(cause.response?.data?.message || "Delivery preferences could not be loaded."); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const preferences = settings?.preferences || DEFAULT_PREFERENCES;

    const save = async (changes = {}) => {
        if (!settings || saving) return false;
        setSaving(true);
        setError("");
        setNotice("");
        const request = {
            emailEnabled: preferences.emailEnabled,
            emailCategories: preferences.emailCategories || [],
            phoneNumber: phoneNumber.trim(),
            whatsappEnabled: consent && preferences.whatsappEnabled || false,
            whatsappCategories: preferences.whatsappCategories || [],
            whatsappConsent: consent,
            ...changes,
        };
        try {
            const response = await notificationService.updateNotificationPreferences(request);
            setSettings((current) => ({ ...current, ...response.data }));
            setPhoneNumber(response.data.phoneNumber || "");
            setConsent(Boolean(response.data.preferences?.whatsappConsentAt));
            setNotice("Delivery preferences saved.");
            return true;
        } catch (cause) {
            setError(cause.response?.data?.message || "Preferences could not be saved.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const toggleCategory = (channel, category) => {
        const key = `${channel}Categories`;
        const current = preferences[key] || [];
        const next = current.includes(category) ? current.filter((item) => item !== category) : [...current, category];
        void save({ [key]: next });
    };

    const testChannel = async (channel) => {
        setTesting(channel);
        setError("");
        setNotice("");
        try {
            const response = await notificationService.sendTestNotification(channel);
            setNotice(response.message || "Test notification sent.");
        } catch (cause) {
            setError(cause.response?.data?.message || "Test notification could not be sent.");
        } finally {
            setTesting("");
        }
    };

    if (loading || !settings) return <p role="status" className="text-sm text-slate-500">{error || "Loading delivery preferences…"}</p>;

    const phoneValid = E164_PATTERN.test(phoneNumber.trim());
    const canTestEmail = settings.emailConfigured && settings.emailVerified && preferences.emailEnabled;
    const canTestWhatsApp = settings.whatsappConfigured && preferences.whatsappEnabled && consent && phoneValid;

    return <section aria-labelledby="notification-preferences-title" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 id="notification-preferences-title" className="text-sm font-bold text-slate-900">Email delivery</h2><p className="mt-1 text-xs leading-5 text-slate-500">In-app notifications are always available. Email is optional.</p></div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={preferences.emailEnabled} disabled={saving || !settings.emailConfigured || !settings.emailVerified} onChange={(event) => void save({ emailEnabled: event.target.checked })} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Email enabled
            </label>
        </div>
        {!settings.emailConfigured && <p className="text-xs text-amber-700">Email delivery is not configured. Set RESEND_API_KEY and NOTIFICATION_EMAIL_FROM on the backend.</p>}
        {settings.emailConfigured && !settings.emailVerified && <p className="text-xs text-amber-700">Email alerts require a verified account email address.</p>}
        {settings.emailConfigured && settings.emailVerified && <fieldset disabled={saving || !preferences.emailEnabled} className="flex flex-wrap gap-x-4 gap-y-2">{CATEGORIES.map((category) => <label key={`email-${category}`} className="inline-flex items-center gap-2 text-xs capitalize text-slate-600"><input type="checkbox" checked={(preferences.emailCategories || []).includes(category)} onChange={() => toggleCategory("email", category)} className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />{category}</label>)}</fieldset>}

        <div className="border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="text-sm font-bold text-slate-900">WhatsApp delivery</h3><p className="mt-1 text-xs leading-5 text-slate-500">Messages use the phone number saved to your EverKeep account.</p></div>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={Boolean(preferences.whatsappEnabled)} disabled={saving || !settings.whatsappConfigured || !phoneValid || !consent} onChange={(event) => void save({ whatsappEnabled: event.target.checked, whatsappConsent: consent })} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    WhatsApp enabled
                </label>
            </div>
            {!settings.whatsappConfigured && !settings.whatsappCredentialsConfigured && <p className="mt-2 text-xs text-amber-700">Twilio WhatsApp credentials or sender are missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN or TWILIO_API_KEY and TWILIO_API_SECRET, and TWILIO_WHATSAPP_FROM on the backend.</p>}
            {!settings.whatsappConfigured && settings.whatsappCredentialsConfigured && <p className="mt-2 text-xs text-amber-700">For Sandbox testing set TWILIO_WHATSAPP_SANDBOX=true. For production reminders, set TWILIO_WHATSAPP_CONTENT_SID to an approved Twilio template.</p>}
            {settings.whatsappConfigured && settings.whatsappSandbox && <p className="mt-2 text-xs text-sky-700">Twilio Sandbox is configured. Each recipient must join the Sandbox; free-form messages are limited to its active service window, and business-initiated reminders require an approved Sandbox template.</p>}
            {settings.whatsappConfigured && !settings.whatsappScheduledDeliveryReady && <p className="mt-2 text-xs text-amber-700">WhatsApp test messages can be sent in an active Sandbox window; scheduled WhatsApp reminders need an approved template SID.</p>}
            {settings.whatsappConfigured && !settings.whatsappSandbox && <p className="mt-2 text-xs text-slate-500">Production messages use the configured approved Twilio content template.</p>}
            {settings.whatsappConfigured && !settings.whatsappStatusCallbackConfigured && <p className="mt-2 text-xs text-slate-500">Status callbacks are not configured. Twilio acceptance can be recorded, but final handset delivery cannot be confirmed.</p>}
            <label className="mt-3 block text-xs font-medium text-slate-700">Mobile number (international format)
                <input type="tel" inputMode="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => { const next = event.target.value; setPhoneNumber(next); setConsent(next.trim() === (settings.phoneNumber || "") ? Boolean(preferences.whatsappConsentAt) : false); }} placeholder="+919876543210" maxLength={16} aria-describedby="whatsapp-phone-help" className="mt-1 block w-full max-w-sm rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <p id="whatsapp-phone-help" className="mt-1 text-xs text-slate-500">Use E.164 format, including country code. For example, an Indian number starts with +91.</p>
            {phoneNumber && !phoneValid && <p className="mt-1 text-xs text-rose-600">Enter a valid international number before enabling WhatsApp.</p>}
            <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-600">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                I agree to receive EverKeep reminder messages on WhatsApp. I can turn them off here at any time.
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => void save({ whatsappConsent: consent, whatsappEnabled: preferences.whatsappEnabled && consent })} disabled={saving} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Save WhatsApp settings</button>
                <button type="button" onClick={() => void testChannel("whatsapp")} disabled={!canTestWhatsApp || Boolean(testing) || saving} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{testing === "whatsapp" ? "Sending…" : "Send WhatsApp test"}</button>
            </div>
        </div>

        {preferences.whatsappEnabled && <fieldset disabled={saving} className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3">{CATEGORIES.map((category) => <label key={`whatsapp-${category}`} className="inline-flex items-center gap-2 text-xs capitalize text-slate-600"><input type="checkbox" checked={(preferences.whatsappCategories || []).includes(category)} onChange={() => toggleCategory("whatsapp", category)} className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />{category}</label>)}</fieldset>}

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
            <button type="button" onClick={() => void testChannel("email")} disabled={!canTestEmail || Boolean(testing) || saving} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{testing === "email" ? "Sending…" : "Send email test"}</button>
            {notice && <p role="status" className="text-xs text-emerald-700">{notice}</p>}
            {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        </div>
    </section>;
}
