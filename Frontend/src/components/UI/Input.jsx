const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder || ""}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  );
};

export default InputField;
