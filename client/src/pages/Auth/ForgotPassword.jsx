import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../services/auth.service";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        setError("");
        try {
            const response = await requestPasswordReset(email.trim().toLowerCase());
            setStatus(response.message);
        } catch {
            setStatus("If an account matches that address and email delivery is configured, a password reset link will be sent.");
            setError("The request could not be completed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-950">Reset your password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Enter your account email. If a matching account exists, we’ll send a one-time reset link.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
                <label htmlFor="recovery-email" className="block text-sm font-medium text-slate-700">Email address</label>
                <input id="recovery-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Sending…" : "Send reset link"}</button>
            </form>
            {status && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p>}
            {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
            <p className="mt-6 text-sm text-slate-600"><Link className="font-semibold text-indigo-700 hover:underline" to="/login">Back to login</Link></p>
            <p className="mt-4 text-xs leading-5 text-slate-500">Password recovery email requires backend configuration for <code>RESEND_API_KEY</code>, <code>NOTIFICATION_EMAIL_FROM</code>, and <code>CLIENT_URL</code>.</p>
        </section>
    </main>;
}
