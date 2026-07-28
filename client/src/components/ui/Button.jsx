const variants = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100",

    secondary:
        "bg-slate-900 text-white hover:bg-slate-800",

    outline:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",

    ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100",

    danger:
        "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
    sm: "h-10 px-4 text-sm",

    md: "h-12 px-6 text-base",

    lg: "h-14 px-8 text-lg",
};

const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    disabled = false,
    loading = false,
    onClick,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        font-semibold
        transition-all
        duration-300
        active:scale-95
        hover:-translate-y-0.5
        disabled:pointer-events-none
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {loading ? (
                <>
                    <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            opacity=".2"
                        />

                        <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>

                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;