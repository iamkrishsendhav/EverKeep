import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

// ============================================================================
// LOGIN
// ============================================================================

const Login = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const { login, isAuthenticated, loading: authLoading } = useAuth();

    // =========================================================================
    // FORM STATE
    // =========================================================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // =========================================================================
    // REDIRECT IF ALREADY AUTHENTICATED
    // =========================================================================

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/dashboard", {
                replace: true,
            });
        }
    }, [authLoading, isAuthenticated, navigate]);

    // =========================================================================
    // INPUT HANDLER
    // =========================================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        // Clear previous error as soon as
        // the user starts correcting the form.

        if (error) {
            setError("");
        }
    };

    // =========================================================================
    // EMAIL VALIDATION
    // =========================================================================

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // =========================================================================
    // LOGIN SUBMIT
    // =========================================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prevent duplicate requests.

        if (loading) {
            return;
        }

        const email = formData.email.trim().toLowerCase();

        const password = formData.password;

        // ---------------------------------------------------------------------
        // VALIDATION
        // ---------------------------------------------------------------------

        if (!email) {
            setError("Please enter your email address.");

            return;
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");

            return;
        }

        if (!password) {
            setError("Please enter your password.");

            return;
        }

        try {
            setLoading(true);

            setError("");

            // -----------------------------------------------------------------
            // LOGIN API
            // -----------------------------------------------------------------

            const response = await loginUser({
                email,
                password,
            });

            // -----------------------------------------------------------------
            // EXTRACT RESPONSE
            // -----------------------------------------------------------------

            const user = response?.data?.user;

            const token = response?.data?.token;

            // -----------------------------------------------------------------
            // SAFETY CHECK
            // -----------------------------------------------------------------

            if (!token) {
                throw new Error(
                    "Login succeeded but authentication token was not received.",
                );
            }

            // -----------------------------------------------------------------
            // AUTH CONTEXT
            // -----------------------------------------------------------------
            //
            // AuthContext handles:
            // - token storage
            // - user storage
            // - React authentication state
            //
            // Do NOT duplicate localStorage logic here.
            // -----------------------------------------------------------------

            login({
                token,
                user,
            });

            // -----------------------------------------------------------------
            // REDIRECT
            // -----------------------------------------------------------------
            //
            // If user originally tried to open a protected page,
            // return them there. Otherwise open dashboard.
            // -----------------------------------------------------------------

            const redirectPath = location.state?.from?.pathname || "/dashboard";

            const redirectSearch = location.state?.from?.search || "";

            navigate(`${redirectPath}${redirectSearch}`, {
                replace: true,
            });
        } catch (error) {
            console.error("Login failed:", error);

            // -----------------------------------------------------------------
            // USER-FRIENDLY ERROR
            // -----------------------------------------------------------------

            const backendMessage = error?.response?.data?.message;

            if (backendMessage) {
                setError(backendMessage);
            } else if (error?.response?.status === 401) {
                setError("Invalid email or password.");
            } else if (error?.response?.status >= 500) {
                setError("Server error. Please try again in a moment.");
            } else {
                setError(error?.message || "Unable to sign in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // =========================================================================
    // LOADING AUTH STATE
    // =========================================================================

    if (authLoading) {
        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        font-medium
                        text-slate-500
                    "
                >
                    <span
                        className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-200
                            border-t-slate-900
                        "
                    />
                    Checking your session...
                </div>
            </main>
        );
    }

    // =========================================================================
    // UI
    // =========================================================================

    return (
        <main className="min-h-screen bg-slate-50">
            <div
                className="
                    grid
                    min-h-screen
                    lg:grid-cols-[1.05fr_0.95fr]
                "
            >
                {/* ============================================================
                    BRAND PANEL
                ============================================================ */}

                <section
                    className="
                        relative
                        hidden
                        overflow-hidden
                        bg-slate-950
                        p-12
                        lg:flex
                        lg:flex-col
                        lg:justify-between
                        xl:p-16
                    "
                >
                    {/* Decorative glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-24
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-indigo-500/20
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -right-24
                            h-96
                            w-96
                            rounded-full
                            bg-emerald-400/10
                            blur-3xl
                        "
                    />

                    {/* Subtle grid */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            opacity-[0.035]
                            [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
                            [background-size:42px_42px]
                        "
                    />

                    {/* Brand */}

                    <div className="relative">
                        <Link
                            to="/"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-3
                                rounded-2xl
                                outline-none
                                focus-visible:ring-2
                                focus-visible:ring-white/20
                            "
                        >
                            <div
                                className="
                                    grid
                                    h-11
                                    w-11
                                    place-items-center
                                    rounded-2xl
                                    bg-white
                                    text-slate-950
                                    shadow-xl
                                    transition
                                    duration-200
                                    group-hover:scale-[1.03]
                                "
                            >
                                <ShieldCheck size={22} strokeWidth={2.2} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-lg
                                        font-bold
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    EverKeep
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Keep What Matters.
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Main brand message */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                        className="
                            relative
                            max-w-xl
                        "
                    >
                        <p
                            className="
                                mb-4
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-indigo-300
                            "
                        >
                            Your personal asset vault
                        </p>

                        <h1
                            className="
                                text-4xl
                                font-semibold
                                leading-[1.08]
                                tracking-tight
                                text-white
                                xl:text-5xl
                            "
                        >
                            Everything you care about,
                            <span
                                className="
                                    block
                                    text-indigo-300
                                "
                            >
                                kept in one place.
                            </span>
                        </h1>

                        <p
                            className="
                                mt-6
                                max-w-lg
                                text-sm
                                leading-7
                                text-slate-400
                            "
                        >
                            Manage your assets, warranties, subscriptions, documents and
                            important reminders from one organized workspace.
                        </p>

                        {/* Trust points */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                Organized
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                Private
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                Always accessible
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer */}

                    <div
                        className="
                            relative
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-500
                        "
                    >
                        <LockKeyhole size={14} />
                        Secure personal workspace
                    </div>
                </section>

                {/* ============================================================
                    LOGIN PANEL
                ============================================================ */}

                <section
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        px-5
                        py-10
                        sm:px-8
                    "
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 14,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="
                            w-full
                            max-w-md
                        "
                    >
                        {/* ====================================================
                            MOBILE BRAND
                        ==================================================== */}

                        <div
                            className="
                                mb-10
                                flex
                                items-center
                                gap-3
                                lg:hidden
                            "
                        >
                            <Link
                                to="/"
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        grid
                                        h-11
                                        w-11
                                        place-items-center
                                        rounded-2xl
                                        bg-slate-950
                                        text-white
                                    "
                                >
                                    <ShieldCheck size={22} />
                                </div>

                                <div>
                                    <p
                                        className="
                                            font-bold
                                            tracking-tight
                                            text-slate-950
                                        "
                                    >
                                        EverKeep
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Keep What Matters.
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* ====================================================
                            HEADER
                        ==================================================== */}

                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-indigo-600
                                "
                            >
                                Welcome back
                            </p>

                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-slate-950
                                    sm:text-[2rem]
                                "
                            >
                                Sign in to EverKeep
                            </h2>

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-slate-500
                                "
                            >
                                Access your assets, documents and reminders.
                            </p>
                        </div>

                        {/* ====================================================
                            FORM
                        ==================================================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                mt-8
                                space-y-5
                            "
                            noValidate
                        >
                            {/* ==================================================
                                EMAIL
                            ================================================== */}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Email address
                                </label>

                                <div
                                    className="
                                        group
                                        relative
                                    "
                                >
                                    <Mail
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                            transition
                                            duration-200
                                            group-focus-within:text-indigo-500
                                        "
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        disabled={loading}
                                        aria-invalid={Boolean(error)}
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            pl-11
                                            pr-4
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            duration-200
                                            placeholder:text-slate-400
                                            hover:border-slate-300
                                            focus:border-indigo-500
                                            focus:ring-4
                                            focus:ring-indigo-500/10
                                            disabled:cursor-not-allowed
                                            disabled:bg-slate-50
                                            disabled:opacity-70
                                        "
                                    />
                                </div>
                            </div>

                            {/* ==================================================
                                PASSWORD
                            ================================================== */}

                            <div>
                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <label
                                        htmlFor="password"
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        Password
                                    </label>
                                </div>

                                <div
                                    className="
                                        group
                                        relative
                                    "
                                >
                                    <LockKeyhole
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                            transition
                                            duration-200
                                            group-focus-within:text-indigo-500
                                        "
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            pl-11
                                            pr-12
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            duration-200
                                            placeholder:text-slate-400
                                            hover:border-slate-300
                                            focus:border-indigo-500
                                            focus:ring-4
                                            focus:ring-indigo-500/10
                                            disabled:cursor-not-allowed
                                            disabled:bg-slate-50
                                            disabled:opacity-70
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        disabled={loading}
                                        className="
                                            absolute
                                            right-2
                                            top-1/2
                                            grid
                                            h-8
                                            w-8
                                            -translate-y-1/2
                                            place-items-center
                                            rounded-lg
                                            text-slate-400
                                            outline-none
                                            transition
                                            hover:bg-slate-100
                                            hover:text-slate-700
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-500/20
                                            disabled:pointer-events-none
                                        "
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {error && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -4,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    role="alert"
                                    aria-live="polite"
                                    className="
                                        rounded-xl
                                        border
                                        border-rose-200
                                        bg-rose-50
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        leading-5
                                        text-rose-700
                                    "
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* ==================================================
                                SUBMIT BUTTON
                            ================================================== */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    group
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-slate-950
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-[0_10px_25px_rgba(15,23,42,0.14)]
                                    outline-none
                                    transition
                                    duration-200
                                    hover:bg-indigo-600
                                    hover:shadow-[0_12px_28px_rgba(79,70,229,0.18)]
                                    focus-visible:ring-4
                                    focus-visible:ring-indigo-500/20
                                    active:scale-[0.995]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:bg-slate-950
                                "
                            >
                                {loading ? (
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/30
                                                border-t-white
                                            "
                                        />
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight
                                            size={16}
                                            className="
                                                transition
                                                duration-200
                                                group-hover:translate-x-0.5
                                            "
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ====================================================
                            REGISTER
                        ==================================================== */}

                        <p
                            className="
                                mt-7
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >
                            Don't have an account?
                            <Link
                                to="/register"
                                className="
                                    ml-1
                                    font-semibold
                                    text-indigo-600
                                    outline-none
                                    transition
                                    hover:text-indigo-700
                                    focus-visible:rounded
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500/20
                                "
                            >
                                Create one
                            </Link>
                        </p>

                        {/* ====================================================
                            SECURITY NOTE
                        ==================================================== */}

                        <div
                            className="
                                mt-8
                                flex
                                items-center
                                justify-center
                                gap-2
                                text-xs
                                text-slate-400
                            "
                        >
                            <ShieldCheck size={14} />
                            Your account is protected by secure authentication.
                        </div>
                    </motion.div>
                </section>
            </div>
        </main>
    );
};

export default Login;
