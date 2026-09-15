// utils/validation.js
// Plain validation functions used by every form (FR2, FR3, FR4, FR6, FR8, FR19).
export const isValidAiubEmail = (email = "") => /^[^\s@]+@aiub\.edu$/i.test(email.trim());

export const isValidPassword = (password = "") => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

export const isRequired = (value = "") => value.trim().length > 0;
export const minLength = (value = "", n) => value.trim().length >= n;
export const noSpaces = (value = "") => !/\s/.test(value);
export const maxLength = (value = "", n) => value.trim().length <= n;

export function validateLogin(values) {
  const errors = {};
  if (!isRequired(values.email)) errors.email = "Email is required.";
  else if (!isValidAiubEmail(values.email)) errors.email = "Use your AIUB email (e.g. name@aiub.edu).";
  if (!isRequired(values.password)) errors.password = "Password is required.";
  else if (values.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

export function validateRegister(values) {
  const errors = {};
  if (!minLength(values.fullName || "", 3)) errors.fullName = "Full name must be at least 3 characters.";
  if (!minLength(values.username || "", 4)) errors.username = "Username must be at least 4 characters.";
  else if (!noSpaces(values.username)) errors.username = "Username cannot contain spaces.";
  if (!isValidAiubEmail(values.email || "")) errors.email = "Use a valid AIUB email (name@aiub.edu).";
  if (!isRequired(values.department || "")) errors.department = "Department is required.";
  if (!isRequired(values.studentId || "")) errors.studentId = "ID is required.";
  if (!isRequired(values.role || "")) errors.role = "Please select a role.";
  if (!isValidPassword(values.password || "")) errors.password = "Min 8 chars, 1 capital letter, 1 number.";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function validateForgotPassword(values) {
  const errors = {};
  if (!isValidAiubEmail(values.email || "")) errors.email = "Enter a valid AIUB email.";
  return errors;
}

export function validatePostContent(values) {
  const errors = {};
  if (!isRequired(values.content || "")) errors.content = "Post content cannot be empty.";
  else if (!maxLength(values.content, 500)) errors.content = "Max 500 characters allowed.";
  if (!isRequired(values.category || "")) errors.category = "Please choose a category.";
  return errors;
}

export function validateComment(text) {
  if (!isRequired(text)) return "Comment cannot be empty.";
  if (!maxLength(text, 200)) return "Max 200 characters allowed.";
  return null;
}

export function validateEditProfile(values) {
  const errors = {};
  if (!minLength(values.fullName || "", 3)) errors.fullName = "Full name must be at least 3 characters.";
  if (!isRequired(values.department || "")) errors.department = "Department is required.";
  return errors;
}
