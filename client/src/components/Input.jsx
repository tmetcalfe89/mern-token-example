import propTypes from "prop-types";
import { useCallback } from "react";

export default function Input({ label, value, onChange }) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={handleChange} />
    </div>
  );
}

Input.propTypes = {
  label: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
};
