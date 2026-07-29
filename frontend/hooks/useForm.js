// hooks/useForm.js
// Small reusable hook so every form (Login, Register, Create Post, Edit Profile...)
// doesn't repeat the same useState + validate boilerplate.
import { useState } from "react";

export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateAll = () => {
    const newErrors = validate ? validate(values) : {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, validateAll, reset, setValues };
}
