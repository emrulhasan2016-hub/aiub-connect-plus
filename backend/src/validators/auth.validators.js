// src/validators/auth.validators.js
// OWNER: Member 1 (Zihadul) - Auth
// Mirrors the rules already used on the frontend (utils/validation.js:
// isValidAiubEmail, isValidPassword) so the backend enforces the same
// contract even if a client bypasses the app's own form validation.

function isValidAiubEmail(email = "") {
  return /^[^\s@]+@aiub\.edu$/i.test(String(email).trim());
}

function isValidPassword(password = "") {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

const ALLOWED_SELF_REGISTER_ROLES = ["Student", "Faculty", "Alumni"];
// Admin accounts are never created through self-registration (matches the
// existing frontend RegisterScreen.js, which only offers these 3 roles).

function validateRegisterInput(body) {
  const errors = {};
  const { fullName, username, email, department, studentId, role, password, confirmPassword } =
    body || {};

  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }
  if (!username || username.trim().length < 4) {
    errors.username = "Username must be at least 4 characters.";
  } else if (/\s/.test(username)) {
    errors.username = "Username cannot contain spaces.";
  }
  if (!isValidAiubEmail(email)) {
    errors.email = "Use a valid AIUB email (name@aiub.edu).";
  }
  if (!department || !department.trim()) {
    errors.department = "Department is required.";
  }
  if (!studentId || !studentId.trim()) {
    errors.studentId = "ID is required.";
  }
  if (!role || !ALLOWED_SELF_REGISTER_ROLES.includes(role)) {
    errors.role = "Please select a valid role (Student, Faculty, or Alumni).";
  }
  if (!isValidPassword(password)) {
    errors.password = "Min 8 chars, 1 capital letter, 1 number.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function validateLoginInput(body) {
  const errors = {};
  const { email, password } = body || {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidAiubEmail(email)) {
    errors.email = "Use your AIUB email (e.g. name@aiub.edu).";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (String(password).length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

function validateForgotPasswordInput(body) {
  const errors = {};
  if (!isValidAiubEmail(body?.email)) {
    errors.email = "Enter a valid AIUB email.";
  }
  return errors;
}

module.exports = {
  isValidAiubEmail,
  isValidPassword,
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
};
