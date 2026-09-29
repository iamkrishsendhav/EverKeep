import { useEffect, useMemo, useRef, useState } from "react";
import {
    AtSign,
    Check,
    ChevronDown,
    Loader2,
    Mail,
    Send,
    Shield,
    UserPlus,
    X,
} from "lucide-react";

import {
    inviteFamilyMember,
    FamilyApiError,
} from "../../services/family.service";

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLE_OPTIONS = [
    {
        value: "member",
        label: "Member",
        description: "Standard family access",
    },
    {
        value: "admin",
        label: "Admin",
        description: "Manage family members and resources",
    },
];

// ============================================================================
// HELPERS
// ============================================================================

const normalizeError = (error) => {
    if (error instanceof FamilyApiError) {
        return error.message;
    }

    return (
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send the invitation."
    );
};

// ============================================================================
// COMPONENT
// ============================================================================

const FamilyInviteMember = ({ onClose, onSuccess, family = null }) => {
    const emailInputRef = useRef(null);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [roleOpen, setRoleOpen] = useState(false);

    // ------------------------------------------------------------------------
    // SELECTED ROLE
    // ------------------------------------------------------------------------

    const selectedRole = useMemo(
        () =>
            ROLE_OPTIONS.find((option) => option.value === role) || ROLE_OPTIONS[0],
        [role],
    );

    // ------------------------------------------------------------------------
    // EMAIL VALIDATION
    // ------------------------------------------------------------------------

    const emailIsValid = useMemo(() => {
        const value = email.trim();

        if (!value) {
            return false;
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }, [email]);

    // ------------------------------------------------------------------------
    // CLOSE ROLE MENU
    // ------------------------------------------------------------------------

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!event.target.closest("[data-family-role-menu]")) {
                setRoleOpen(false);
            }
        };

        if (roleOpen) {
            document.addEventListener("mousedown", handlePointerDown);
        }

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [roleOpen]);

    // ------------------------------------------------------------------------
    // FOCUS EMAIL
    // ------------------------------------------------------------------------

    useEffect(() => {
        const timer = window.setTimeout(() => {
            emailInputRef.current?.focus();
        }, 100);

        return () => window.clearTimeout(timer);
    }, []);

    // ------------------------------------------------------------------------
    // SUBMIT
    // ------------------------------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Please enter an email address.");
            emailInputRef.current?.focus();
            return;
        }

        if (!emailIsValid) {
            setError("Please enter a valid email address.");
            emailInputRef.current?.focus();
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess(false);

            const response = await inviteFamilyMember({
                email: normalizedEmail,
                role,
            });

            setSuccess(true);

            if (typeof onSuccess === "function") {
                onSuccess(response);
            }

            setEmail("");
        } catch (requestError) {
            console.error("Family invitation error:", requestError);

            setError(normalizeError(requestError));
        } finally {
            setSubmitting(false);
        }
    };

    // ------------------------------------------------------------------------
    // CANCEL
    // ------------------------------------------------------------------------

    const handleClose = () => {
        if (submitting) {
            return;
        }

        onClose?.();
    };

    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-gray-950/40
                px-4
                py-6
                backdrop-blur-sm
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="family-invite-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="
                    relative
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    shadow-2xl
                    dark:border-gray-800
                    dark:bg-gray-900
                "
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* ========================================================= */}
                {/* CLOSE */}
                {/* ========================================================= */}

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    aria-label="Close"
                    className="
                        absolute
                        right-4
                        top-4
                        z-10
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        text-gray-400
                        transition
                        hover:bg-gray-100
                        hover:text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:hover:bg-gray-800
                        dark:hover:text-gray-200
                    "
                >
                    <X size={17} />
                </button>

                {/* ========================================================= */}
                {/* HEADER */}
                {/* ========================================================= */}

                <div className="px-6 pb-5 pt-7 sm:px-7">
                    <div className="flex items-start gap-4">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gray-950
                                text-white
                                dark:bg-white
                                dark:text-gray-950
                            "
                        >
                            <UserPlus size={19} />
                        </div>

                        <div className="min-w-0 pr-7">
                            <h2
                                id="family-invite-title"
                                className="
                                    text-base
                                    font-semibold
                                    tracking-tight
                                    text-gray-950
                                    dark:text-white
                                "
                            >
                                Invite a family member
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            >
                                Send an invitation to join your family workspace.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* FAMILY CONTEXT */}
                {/* ========================================================= */}

                {family?.name && (
                    <div
                        className="
                            mx-6
                            mb-5
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-gray-100
                            bg-gray-50
                            px-4
                            py-3
                            sm:mx-7
                            dark:border-gray-800
                            dark:bg-gray-950
                        "
                    >
                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-gray-500
                                shadow-sm
                                dark:bg-gray-900
                                dark:text-gray-400
                            "
                        >
                            <Shield size={14} />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.08em]
                                    text-gray-400
                                "
                            >
                                Family workspace
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                {family.name}
                            </p>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* FORM */}
                {/* ========================================================= */}

                <form onSubmit={handleSubmit} className="px-6 pb-6 sm:px-7 sm:pb-7">
                    {/* EMAIL */}

                    <div>
                        <label
                            htmlFor="family-member-email"
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                size={15}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                ref={emailInputRef}
                                id="family-member-email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError("");
                                    setSuccess(false);
                                }}
                                placeholder="name@example.com"
                                autoComplete="email"
                                disabled={submitting}
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    pl-10
                                    pr-4
                                    text-xs
                                    text-gray-900
                                    outline-none
                                    transition
                                    placeholder:text-gray-300
                                    focus:border-gray-400
                                    focus:ring-4
                                    focus:ring-gray-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-50
                                    dark:border-gray-800
                                    dark:bg-gray-950
                                    dark:text-white
                                    dark:placeholder:text-gray-700
                                    dark:focus:border-gray-600
                                    dark:focus:ring-gray-800
                                    dark:disabled:bg-gray-950
                                "
                            />
                        </div>
                    </div>

                    {/* ROLE */}

                    <div className="mt-5">
                        <label
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Family role
                        </label>

                        <div className="relative" data-family-role-menu>
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => setRoleOpen((current) => !current)}
                                className="
                                    flex
                                    min-h-11
                                    w-full
                                    items-center
                                    justify-between
                                    gap-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3.5
                                    text-left
                                    transition
                                    hover:border-gray-300
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    dark:border-gray-800
                                    dark:bg-gray-950
                                    dark:hover:border-gray-700
                                "
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-gray-100
                                            text-gray-500
                                            dark:bg-gray-800
                                            dark:text-gray-400
                                        "
                                    >
                                        <Shield size={14} />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-gray-800
                                                dark:text-gray-200
                                            "
                                        >
                                            {selectedRole.label}
                                        </p>

                                        <p
                                            className="
                                                truncate
                                                text-[10px]
                                                text-gray-400
                                                dark:text-gray-500
                                            "
                                        >
                                            {selectedRole.description}
                                        </p>
                                    </div>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className={`
                                        shrink-0
                                        text-gray-400
                                        transition
                                        ${roleOpen ? "rotate-180" : ""}
                                    `}
                                />
                            </button>

                            {roleOpen && (
                                <div
                                    className="
                                        absolute
                                        left-0
                                        right-0
                                        top-[calc(100%+6px)]
                                        z-20
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-1.5
                                        shadow-xl
                                        dark:border-gray-700
                                        dark:bg-gray-900
                                    "
                                >
                                    {ROLE_OPTIONS.map((option) => {
                                        const active = option.value === role;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setRole(option.value);
                                                    setRoleOpen(false);
                                                }}
                                                className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        transition
                                                        hover:bg-gray-50
                                                        dark:hover:bg-gray-800
                                                    "
                                            >
                                                <div>
                                                    <p
                                                        className="
                                                                text-xs
                                                                font-semibold
                                                                text-gray-800
                                                                dark:text-gray-200
                                                            "
                                                    >
                                                        {option.label}
                                                    </p>

                                                    <p
                                                        className="
                                                                mt-0.5
                                                                text-[10px]
                                                                text-gray-400
                                                            "
                                                    >
                                                        {option.description}
                                                    </p>
                                                </div>

                                                {active && (
                                                    <Check
                                                        size={14}
                                                        className="
                                                                shrink-0
                                                                text-gray-900
                                                                dark:text-white
                                                            "
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ERROR */}

                    {error && (
                        <div
                            role="alert"
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-3.5
                                py-3
                                text-[11px]
                                leading-5
                                text-red-600
                                dark:border-red-900/50
                                dark:bg-red-950/30
                                dark:text-red-400
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* SUCCESS */}

                    {success && (
                        <div
                            role="status"
                            className="
                                mt-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-emerald-200
                                bg-emerald-50
                                px-3.5
                                py-3
                                dark:border-emerald-900/50
                                dark:bg-emerald-950/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-6
                                    w-6
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-emerald-100
                                    text-emerald-600
                                    dark:bg-emerald-900/50
                                    dark:text-emerald-400
                                "
                            >
                                <Check size={13} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        text-emerald-700
                                        dark:text-emerald-400
                                    "
                                >
                                    Invitation sent
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]
                                        leading-4
                                        text-emerald-600/80
                                        dark:text-emerald-400/70
                                    "
                                >
                                    The family member can join using the invitation email.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ACTIONS */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col-reverse
                            gap-2
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="
                                h-10
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                text-xs
                                font-semibold
                                text-gray-600
                                transition
                                hover:bg-gray-50
                                hover:text-gray-900
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-gray-800
                                dark:text-gray-400
                                dark:hover:bg-gray-800
                                dark:hover:text-white
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || !emailIsValid}
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gray-950
                                px-4
                                text-xs
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:bg-white
                                dark:text-gray-950
                                dark:hover:bg-gray-200
                            "
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    Send invitation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FamilyInviteMember;
