import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { motion } from "framer-motion";

import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";


// ============================================================================
// REGISTER
// ============================================================================

const Register = () => {

    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();


    // =========================================================================
    // FORM STATE
    // =========================================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================================
    // REDIRECT IF ALREADY AUTHENTICATED
    // =========================================================================

    useEffect(() => {

        if (
            !authLoading &&
            isAuthenticated
        ) {

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );

        }

    }, [
        authLoading,
        isAuthenticated,
        navigate,
    ]);


    // =========================================================================
    // INPUT HANDLER
    // =========================================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));


        if (error) {
            setError("");
        }

    };


    // =========================================================================
    // EMAIL VALIDATION
    // =========================================================================

    const isValidEmail = (email) => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );

    };


    // =========================================================================
    // REGISTER
    // =========================================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (loading) {
            return;
        }


        const name =
            formData.name.trim();

        const email =
            formData.email.trim().toLowerCase();

        const password =
            formData.password;

        const confirmPassword =
            formData.confirmPassword;


        // =====================================================================
        // VALIDATION
        // =====================================================================

        if (!name) {

            setError(
                "Please enter your full name."
            );

            return;
        }


        if (name.length < 2) {

            setError(
                "Name must contain at least 2 characters."
            );

            return;
        }


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!isValidEmail(email)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        if (!password) {

            setError(
                "Please create a password."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (!confirmPassword) {

            setError(
                "Please confirm your password."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        // =====================================================================
        // API
        // =====================================================================

        try {

            setLoading(true);

            setError("");


            const response =
                await registerUser({
                    name,
                    email,
                    password,
                });


            // =================================================================
            // RESPONSE
            // =================================================================

            const user =
                response?.data?.user;

            const token =
                response?.data?.token;


            if (!token) {

                throw new Error(
                    "Account was created but authentication token was not received."
                );

            }


            // =================================================================
            // AUTH CONTEXT
            // =================================================================
            //
            // Do not write token/user directly to localStorage here.
            //
            // AuthContext is now the single source of truth.
            // =================================================================

            login({
                token,
                user,
            });


            // =================================================================
            // DASHBOARD
            // =================================================================

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );


            const status =
                error?.response?.status;


            const backendMessage =
                error?.response?.data?.message;


            if (status === 409) {

                setError(
                    backendMessage ||
                    "An account with this email already exists."
                );

            } else if (
                status >= 500
            ) {

                setError(
                    "Server error. Please try again in a moment."
                );

            } else {

                setError(
                    backendMessage ||
                    error?.message ||
                    "Unable to create your account. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================================================================
    // AUTH RESTORE SCREEN
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
                        rounded-2xl
                        border
                        border-slate-200/80
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-slate-600
                        shadow-[0_12px_32px_rgba(15,23,42,0.06)]
                    "
                >

                    <span
                        className="
                            h-4
                            w-4
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
                    lg:grid-cols-[0.95fr_1.05fr]
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
                            -right-24
                            -top-24
                            h-80
                            w-80
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
                            -left-24
                            h-96
                            w-96
                            rounded-full
                            bg-emerald-400/10
                            blur-3xl
                        "
                    />


                    {/* Subtle background grid */}

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

                                <ShieldCheck
                                    size={22}
                                    strokeWidth={2.2}
                                />

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


                    {/* Main content */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
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
                            Start your EverKeep journey
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

                            Keep everything important,

                            <span
                                className="
                                    block
                                    text-indigo-300
                                "
                            >
                                organized and protected.
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
                            Create your personal EverKeep workspace
                            and keep your assets, documents,
                            warranties and subscriptions organized.
                        </p>


                        {/* Benefits */}

                        <div
                            className="
                                mt-8
                                space-y-3
                            "
                        >

                            {[
                                "One organized workspace",
                                "Track important documents and warranties",
                                "Never miss important renewals",
                            ].map((item) => (

                                <div
                                    key={item}
                                    className="
                                        flex
                                        items-center
                                        gap-2.5
                                        text-xs
                                        font-medium
                                        text-slate-400
                                    "
                                >

                                    <CheckCircle2
                                        size={15}
                                        className="
                                            shrink-0
                                            text-emerald-400
                                        "
                                    />

                                    {item}

                                </div>

                            ))}

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

                        <LockKeyhole
                            size={14}
                        />

                        Secure personal workspace

                    </div>

                </section>


                {/* ============================================================
                    REGISTER PANEL
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

                                    <ShieldCheck
                                        size={22}
                                    />

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
                                Get started
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Create your account
                            </h2>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-slate-500
                                "
                            >
                                Start organizing your digital assets
                                with EverKeep.
                            </p>

                        </div>


                        {/* ====================================================
                            FORM
                        ==================================================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                mt-8
                                space-y-4
                            "
                            noValidate
                        >

                            {/* ==================================================
                                NAME
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="name"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Full name
                                </label>


                                <div className="group relative">

                                    <UserRound
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
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        disabled={loading}
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


                                <div className="group relative">

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

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Password
                                </label>


                                <div className="group relative">

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
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="At least 6 characters"
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
                                        onClick={() =>
                                            setShowPassword(
                                                (value) =>
                                                    !value
                                            )
                                        }
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
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (

                                            <EyeOff size={17} />

                                        ) : (

                                            <Eye size={17} />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* ==================================================
                                CONFIRM PASSWORD
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Confirm password
                                </label>


                                <div className="group relative">

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
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        placeholder="Repeat your password"
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
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (value) =>
                                                    !value
                                            )
                                        }
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
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showConfirmPassword ? (

                                            <EyeOff size={17} />

                                        ) : (

                                            <Eye size={17} />

                                        )}

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
                                SUBMIT
                            ================================================== */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    group
                                    mt-2
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

                                        Creating account...

                                    </span>

                                ) : (

                                    <>
                                        Create account
                                    </>

                                )}

                            </button>

                        </form>


                        {/* ====================================================
                            LOGIN LINK
                        ==================================================== */}

                        <p
                            className="
                                mt-7
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >

                            Already have an account?

                            <Link
                                to="/login"
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
                                Sign in
                            </Link>

                        </p>


                        {/* ====================================================
                            SECURITY
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

                            <ShieldCheck
                                size={14}
                            />

                            Your account is protected by
                            secure authentication.

                        </div>

                    </motion.div>

                </section>

            </div>

        </main>

    );

};


export default Register;