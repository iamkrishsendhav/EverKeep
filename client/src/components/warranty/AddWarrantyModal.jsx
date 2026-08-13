import { X, ShieldCheck } from "lucide-react";

import WarrantyForm from "./WarrantyForm";


const AddWarrantyModal = ({
    onClose,
    onCreated,
}) => {

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (formData) => {

        if (!onCreated) {
            return;
        }

        await onCreated(formData);
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-sm
            "
            onMouseDown={onClose}
        >

            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-warranty-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className="
                    flex
                    w-full
                    max-w-xl
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.25)]
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-200/80
                        px-6
                        py-5
                    "
                >

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        {/* ICON */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-indigo-50
                                text-[#5B4BFF]
                            "
                        >
                            <ShieldCheck
                                size={21}
                                strokeWidth={2}
                            />
                        </div>


                        {/* TITLE */}

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-500
                                "
                            >
                                Warranty
                            </p>

                            <h2
                                id="add-warranty-title"
                                className="
                                    mt-0.5
                                    truncate
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Add warranty
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Add coverage details to keep
                                your warranty organized.
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close add warranty"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition-all
                            duration-200
                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-800
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50
                        "
                    >
                        <X size={17} />
                    </button>

                </header>


                {/* ==================================================
                    BODY
                ================================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-6
                        py-6
                    "
                >

                    <WarrantyForm
                        mode="create"
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />

                </div>

            </div>

        </div>
    );
};


export default AddWarrantyModal;