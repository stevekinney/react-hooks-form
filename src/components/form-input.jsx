const FormInput = ({
  id,
  type = 'text',
  label,
  value = '',
  placeholder = label,
  onChange = () => {},
  required = false,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default FormInput;
