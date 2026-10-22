import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = searchParams.get("token") || "";

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        if (password !== confirmation) return setError("Passwords do not match.");
        if (new TextEncoder().encode(password).length > 72) return setError("Password must be no more than 72 UTF-8 bytes.");
        setLoading(true);
        window.history.replaceState({}, "", window.location.pathname);
        try {
            await resetPassword(token, password);
            setDone(true);
        } catch (cause) {
            setError(cause.response?.data?.message || "This password reset link is invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Choose a new password</h1>
        {done ? <div className="mt-5"><p role="status" className="text-sm text-emerald-800">Your password has been reset. Existing sessions have been signed out.</p><Link to="/login" className="mt-5 inline-block font-semibold text-indigo-700">Go to login</Link></div> : !token ? <p role="alert" className="mt-4 text-sm text-rose-700">This password reset link is invalid or expired.</p> : <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">New password<input type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <label className="block text-sm font-medium text-slate-700">Confirm password<input type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Updating…" : "Reset password"}</button>
        </form>}
    </section></main>;
}
