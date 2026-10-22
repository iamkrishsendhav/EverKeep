import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationPreferences from "../../components/notifications/NotificationPreferences";
import { requestEmailVerification } from "../../services/auth.service";

export default function Settings() {
    const { user } = useAuth();
    const [verificationState, setVerificationState] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [sendingVerification, setSendingVerification] = useState(false);

    const sendVerification = async () => {
        setSendingVerification(true);
        setVerificationError("");
        setVerificationState("");
        try {
            const response = await requestEmailVerification();
            setVerificationState(response.message || "Verification email sent.");
        } catch (error) {
            setVerificationError(error.response?.data?.message || "Could not send a verification email.");
        } finally {
            setSendingVerification(false);
        }
    };

    return <div className="space-y-6">
        <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage your account details and notification delivery preferences.</p>
        </header>

        <section aria-labelledby="account-settings-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 id="account-settings-heading" className="text-base font-semibold text-slate-900">Account</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-xs font-medium text-slate-500">Name</dt><dd className="mt-1 text-sm text-slate-900">{user?.name || "Not provided"}</dd></div>
                <div><dt className="text-xs font-medium text-slate-500">Email</dt><dd className="mt-1 break-all text-sm text-slate-900">{user?.email || "Not provided"}</dd>
                    <p className={`mt-1 text-xs ${user?.isEmailVerified ? "text-emerald-700" : "text-amber-700"}`}>{user?.isEmailVerified ? "Verified" : "Not verified"}</p>
                    {!user?.isEmailVerified && <button type="button" onClick={sendVerification} disabled={sendingVerification} className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{sendingVerification ? "Sending…" : "Send verification email"}</button>}
                    {verificationState && <p role="status" className="mt-2 text-xs text-emerald-700">{verificationState}</p>}
                    {verificationError && <p role="alert" className="mt-2 text-xs text-rose-700">{verificationError}</p>}
                </div>
            </dl>
        </section>

        <NotificationPreferences />
    </div>;
}
