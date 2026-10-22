import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
    const { refreshUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const token = searchParams.get("token") || "";

    const submit = async () => {
        setLoading(true);
        setError("");
        window.history.replaceState({}, "", window.location.pathname);
        try {
            const response = await verifyEmail(token);
            setStatus(response.message);
            try { await refreshUser(); } catch { /* Verification succeeded; auth refresh can happen on the next sign-in. */ }
        } catch (cause) {
            setError(cause.response?.data?.message || "This verification link is invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Verify your email</h1>
        {status ? <p role="status" className="mt-4 text-sm text-emerald-800">{status}</p> : token ? <><p className="mt-2 text-sm text-slate-600">Use the one-time link to verify your account email.</p><button type="button" onClick={submit} disabled={loading} className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Verifying…" : "Verify email"}</button></> : <p role="alert" className="mt-4 text-sm text-rose-700">This verification link is invalid or expired.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-indigo-700">Back to login</Link>
    </section></main>;
}
