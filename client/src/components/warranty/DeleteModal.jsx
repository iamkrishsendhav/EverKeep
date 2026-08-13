import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect } from "react";


const DeleteModal = ({
    warranty,
    onCancel,
    onConfirm,
    deleting = false,
}) => {

    // ============================================================
    // ESCAPE KEY
    // ============================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (event.key === "Escape" && !deleting) {
                onCancel();
            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [onCancel, deleting]);


    // ============================================================
    // WARRANTY NAME
    // ============================================================

    const warrantyName =
        warranty?.title ||
        warranty?.name ||
        "this warranty";


    return (
        <div
            className="
                fixed
                inset-0
                z-[70]
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
                backdrop-blur-sm
            "
            onMouseDown={() => {
                if (!deleting) {
                    onCancel();
                }
            }}
        >

            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-warranty-title"
                aria-describedby="delete-warranty-description"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.28)]
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200/80
                        px-6
                        py-5
                    "
                >

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-rose-50
                                text-rose-600
                            "
                        >
                            <Trash2
                                size={20}
                                strokeWidth={2}
                            />
                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-rose-500
                                "
                            >
                                Remove warranty
                            </p>

                            <h2
                                id="delete-warranty-title"
                                className="
                                    mt-0.5
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Delete warranty?
                            </h2>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        aria-label="Close delete confirmation"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-800
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        <X size={17} />
                    </button>

                </div>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="px-6 py-6">

                    {/* WARNING */}

                    <div
                        className="
                            flex
                            gap-3
                            rounded-2xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-4
                        "
                    >

                        <AlertTriangle
                            size={19}
                            className="
                                mt-0.5
                                shrink-0
                                text-amber-600
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-amber-900
                                "
                            >
                                This action cannot be undone.
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-amber-800/80
                                "
                            >
                                The warranty record will be
                                permanently removed from your
                                EverKeep workspace.
                            </p>

                        </div>

                    </div>


                    {/* WARRANTY */}

                    <div
                        className="
                            mt-4
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-3
                        "
                    >

                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-slate-400
                            "
                        >
                            Warranty
                        </p>

                        <p
                            className="
                                mt-1
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                            "
                        >
                            {warrantyName}
                        </p>

                    </div>


                    {/* DESCRIPTION */}

                    <p
                        id="delete-warranty-description"
                        className="
                            mt-4
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        Are you sure you want to remove{" "}

                        <span className="
                            font-semibold
                            text-slate-700
                        ">
                            {warrantyName}
                        </span>

                        ?
                    </p>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-slate-200/80
                        bg-slate-50/60
                        px-6
                        py-4
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    {/* CANCEL */}

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            hover:border-slate-300
                            focus:outline-none
                            focus:ring-4
                            focus:ring-slate-100
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-rose-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-[0_10px_25px_rgba(225,29,72,0.18)]
                            transition
                            hover:bg-rose-700
                            focus:outline-none
                            focus:ring-4
                            focus:ring-rose-100
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >

                        {deleting ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />

                                Delete warranty
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default DeleteModal;