import { useState } from "react";

import {
  CalendarDays,
  CreditCard,
  FileText,
  IndianRupee,
  Layers3,
  RefreshCw,
  Tag,
} from "lucide-react";

import { BILLING_CYCLES, SUBSCRIPTION_CATEGORIES } from "./subscriptionHelpers";

// ============================================================================
// FIELD STYLES
// ============================================================================

const inputClass = `
    h-11
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-3
    text-sm
    font-medium
    text-slate-900
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-500/10
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
`;

const labelClass = `
    mb-1.5
    block
    text-[10px]
    font-bold
    uppercase
    tracking-[0.14em]
    text-slate-500
`;

// ============================================================================
// INPUT FIELD
// ============================================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  step,
  icon: Icon,
  disabled = false,
}) => {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}

        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.8}
            className="
                            pointer-events-none
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
            aria-hidden="true"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          disabled={disabled}
          className={`
                        ${inputClass}
                        ${Icon ? "pl-10" : "pl-3.5"}
                    `}
        />
      </div>
    </div>
  );
};

// ============================================================================
// SELECT FIELD
// ============================================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  required = false,
  disabled = false,
}) => {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}

        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
                        ${inputClass}
                        appearance-none
                        pr-10
                    `}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          className="
                        pointer-events-none
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                    "
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION
// ============================================================================

const FormSection = ({ icon: Icon, title, description, children }) => {
  return (
    <section
      className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/80
                bg-white
            "
    >
      {/* Header */}

      <div
        className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-100
                    bg-slate-50/70
                    px-4
                    py-3
                "
      >
        <div
          className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-indigo-100
                        bg-indigo-50
                        text-indigo-600
                    "
        >
          <Icon size={16} strokeWidth={1.9} />
        </div>

        <div className="min-w-0">
          <h3
            className="
                            text-sm
                            font-semibold
                            tracking-tight
                            text-slate-900
                        "
          >
            {title}
          </h3>

          <p
            className="
                            mt-0.5
                            text-[11px]
                            leading-4
                            text-slate-400
                        "
          >
            {description}
          </p>
        </div>
      </div>

      {/* Content */}

      <div className="p-4">{children}</div>
    </section>
  );
};

// ============================================================================
// DEFAULT DATA
// ============================================================================

const DEFAULT_DATA = {
  name: "",
  provider: "",
  plan: "",
  category: "other",
  amount: "",
  currency: "INR",
  billingCycle: "monthly",
  startDate: "",
  nextBillingDate: "",
  autoRenew: true,
  status: "active",
  paymentMethod: "",
  reminderDays: "3",
  notes: "",
};

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
};

// ============================================================================
// SUBSCRIPTION FORM
// ============================================================================

const SubscriptionForm = ({
  mode = "create",
  initialData = {},
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_DATA,
    ...initialData,
    amount: initialData?.amount ?? "",
    reminderDays: initialData?.reminderDays ?? "3",
    autoRenew: initialData?.autoRenew ?? true,
    status: initialData?.status ?? "active",
    startDate: toDateInputValue(initialData?.startDate),
    nextBillingDate: toDateInputValue(initialData?.nextBillingDate),
  });

  const [error, setError] = useState("");

  // =========================================================================
  // CHANGE
  // =========================================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setError("");

    setFormData((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================================
  // TOGGLE AUTO RENEW
  // =========================================================================

  const toggleAutoRenew = () => {
    setFormData((previous) => ({
      ...previous,
      autoRenew: !previous.autoRenew,
    }));
  };

  // =========================================================================
  // SUBMIT
  // =========================================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    // ---------------------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------------------

    if (!formData.name.trim()) {
      setError("Subscription name is required.");
      return;
    }

    if (!formData.provider.trim()) {
      setError("Provider is required.");
      return;
    }

    if (
      formData.amount === "" ||
      formData.amount === null ||
      formData.amount === undefined
    ) {
      setError("Subscription amount is required.");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount)) {
      setError("Please enter a valid subscription amount.");
      return;
    }

    if (amount < 0) {
      setError("Subscription amount cannot be negative.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.billingCycle) {
      setError("Please select a billing cycle.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!formData.nextBillingDate) {
      setError("Next billing date is required.");
      return;
    }

    if (new Date(formData.nextBillingDate) < new Date(formData.startDate)) {
      setError("Next billing date cannot be before the start date.");
      return;
    }

    // ---------------------------------------------------------------------
    // PAYLOAD
    // ---------------------------------------------------------------------

    const payload = {
      name: formData.name.trim(),
      provider: formData.provider.trim(),
      plan: formData.plan.trim(),
      category: formData.category,
      amount,
      currency: formData.currency,
      billingCycle: formData.billingCycle,
      startDate: formData.startDate,
      nextBillingDate: formData.nextBillingDate,
      autoRenew: formData.autoRenew,
      status: formData.status,
      asset: formData.asset?._id || formData.asset || null,
      paymentMethod: formData.paymentMethod.trim(),
      reminderDays: Number(formData.reminderDays) || 0,
      notes: formData.notes.trim(),
    };

    try {
      await onSubmit?.(payload);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to save subscription.",
      );
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="
                flex
                flex-col
                gap-4
            "
    >
      {/* =================================================================
                ERROR
            ================================================================= */}

      {error && (
        <div
          role="alert"
          className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-4
                        py-3
                    "
        >
          <div
            className="
                            mt-0.5
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-rose-100
                            text-[11px]
                            font-bold
                            text-rose-600
                        "
          >
            !
          </div>

          <div className="min-w-0">
            <p
              className="
                                text-xs
                                font-semibold
                                text-rose-800
                            "
            >
              Unable to save subscription
            </p>

            <p
              className="
                                mt-0.5
                                text-[11px]
                                leading-4
                                text-rose-600
                            "
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =================================================================
                BASIC INFORMATION
            ================================================================= */}

      <FormSection
        icon={Layers3}
        title="Basic information"
        description="Tell EverKeep what subscription you're tracking."
      >
        <div
          className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
        >
          <div className="sm:col-span-2">
            <InputField
              label="Subscription name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Netflix"
              required
              disabled={submitting}
              icon={Tag}
            />
          </div>

          <InputField
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            placeholder="e.g. Netflix Inc."
            required
            disabled={submitting}
          />

          <InputField
            label="Plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            placeholder="e.g. Premium"
            disabled={submitting}
          />

          <SelectField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={SUBSCRIPTION_CATEGORIES}
            placeholder="Select category"
            required
            disabled={submitting}
          />

          <SelectField
            label="Billing cycle"
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            options={BILLING_CYCLES}
            placeholder="Select billing cycle"
            required
            disabled={submitting}
          />
        </div>
      </FormSection>

      {/* =================================================================
                BILLING DETAILS
            ================================================================= */}

      <FormSection
        icon={IndianRupee}
        title="Billing details"
        description="Configure cost and renewal dates."
      >
        <div
          className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
        >
          <InputField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            required
            disabled={submitting}
            icon={IndianRupee}
          />

          <SelectField
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            options={[
              {
                value: "INR",
                label: "INR — Indian Rupee",
              },
              {
                value: "USD",
                label: "USD — US Dollar",
              },
              {
                value: "EUR",
                label: "EUR — Euro",
              },
              {
                value: "GBP",
                label: "GBP — British Pound",
              },
            ]}
            disabled={submitting}
          />

          <InputField
            label="Start date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            type="date"
            required
            disabled={submitting}
            icon={CalendarDays}
          />

          <InputField
            label="Next billing date"
            name="nextBillingDate"
            value={formData.nextBillingDate}
            onChange={handleChange}
            type="date"
            required
            disabled={submitting}
            icon={CalendarDays}
          />
        </div>
      </FormSection>

      {/* =================================================================
                RENEWAL & PAYMENT
            ================================================================= */}

      <FormSection
        icon={RefreshCw}
        title="Renewal & payment"
        description="Manage renewal behaviour and payment preferences."
      >
        <div
          className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
        >
          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              {
                value: "active",
                label: "Active",
              },
              {
                value: "paused",
                label: "Paused",
              },
              {
                value: "cancelled",
                label: "Cancelled",
              },
              {
                value: "expired",
                label: "Expired",
              },
            ]}
            disabled={submitting}
          />

          <InputField
            label="Payment method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            placeholder="e.g. UPI, Visa, PayPal"
            disabled={submitting}
            icon={CreditCard}
          />

          <InputField
            label="Reminder days"
            name="reminderDays"
            value={formData.reminderDays}
            onChange={handleChange}
            type="number"
            min="0"
            step="1"
            placeholder="3"
            disabled={submitting}
          />

          {/* ---------------------------------------------------------
                        AUTO RENEW
                    --------------------------------------------------------- */}

          <div
            className="
                            flex
                            min-h-11
                            items-center
                            justify-between
                            gap-4
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50/50
                            px-3.5
                        "
          >
            <div className="min-w-0">
              <p
                className="
                                    text-xs
                                    font-semibold
                                    text-slate-800
                                "
              >
                Auto-renew
              </p>

              <p
                className="
                                    mt-0.5
                                    text-[10px]
                                    text-slate-400
                                "
              >
                Automatically renew
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.autoRenew}
              aria-label="Toggle auto-renew"
              disabled={submitting}
              onClick={toggleAutoRenew}
              className={`
                                relative
                                h-6
                                w-11
                                shrink-0
                                rounded-full
                                transition-colors
                                duration-200
                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-500/10
                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                ${
                                  formData.autoRenew
                                    ? "bg-indigo-600"
                                    : "bg-slate-300"
                                }
                            `}
            >
              <span
                className={`
                                    absolute
                                    top-0.5
                                    h-5
                                    w-5
                                    rounded-full
                                    bg-white
                                    shadow-sm
                                    transition-transform
                                    duration-200

                                    ${
                                      formData.autoRenew
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                    }
                                `}
              />
            </button>
          </div>
        </div>
      </FormSection>

      {/* =================================================================
                NOTES
            ================================================================= */}

      <FormSection
        icon={FileText}
        title="Notes"
        description="Add useful information about this subscription."
      >
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add notes, cancellation details, family plan information..."
          rows={4}
          disabled={submitting}
          className="
                        min-h-[110px]
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3.5
                        py-3
                        text-sm
                        font-medium
                        leading-5
                        text-slate-800
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-indigo-400
                        focus:ring-4
                        focus:ring-indigo-500/10
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                    "
        />
      </FormSection>

      {/* =================================================================
                FOOTER
            ================================================================= */}

      <div
        className="
                    sticky
                    bottom-0
                    z-10
                    -mx-1
                    border-t
                    border-slate-200
                    bg-white/95
                    px-1
                    pt-4
                    backdrop-blur-xl
                "
      >
        <div
          className="
                        flex
                        flex-col-reverse
                        gap-2
                        sm:flex-row
                        sm:justify-end
                    "
        >
          {/* CANCEL */}

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="
                            h-11
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            text-sm
                            font-semibold
                            text-slate-600
                            transition-all
                            duration-200
                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-900
                            focus:outline-none
                            focus:ring-4
                            focus:ring-slate-500/10
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
          >
            Cancel
          </button>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-slate-950
                            px-6
                            text-sm
                            font-semibold
                            text-white
                            shadow-[0_8px_24px_rgba(15,23,42,0.14)]
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-slate-800
                            hover:shadow-[0_12px_28px_rgba(15,23,42,0.18)]
                            focus:outline-none
                            focus:ring-4
                            focus:ring-slate-950/10
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
          >
            {submitting && (
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
            )}

            {submitting
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Add subscription"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SubscriptionForm;
