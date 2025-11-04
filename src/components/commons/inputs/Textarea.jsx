function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-2 text-white">
      {label && <label className="text-sm font-medium">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`
          bg-black border border-white rounded-xl p-3 text-sm resize-none
          placeholder-gray-400 focus:outline-none focus:border-pink-400
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      />
    </div>
  );
}

export default Textarea;
