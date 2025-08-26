export default function SimpleInputField({
  name,
  label,
  placeholder = "Enter text",
  type = "text",
  value,
  disabled = false,
  onChange,
}: SimpleInputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-unbounded font-normal text-on-surface mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={`input-outlined ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onChange={(e) => onChange?.(e)}
      />
    </div>
  );
}
