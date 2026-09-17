import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import useForm from "../hooks/useForm";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";

function validateAddAdmin(values) {
  const errors = {};
  if (!values.fullName || values.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }
  if (!/^[^\s@]+@aiub\.edu$/i.test(values.email || "")) {
    errors.email = "Use a valid AIUB email (name@aiub.edu).";
  }
  if (
    !values.password ||
    values.password.length < 8 ||
    !/[A-Z]/.test(values.password) ||
    !/[0-9]/.test(values.password)
  ) {
    errors.password = "Min 8 chars, 1 capital letter, 1 number.";
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export default function AddAdminScreen({ navigation }) {
  const { createAdmin } = useApp();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { values, errors, handleChange, validateAll, reset } = useForm(
    { fullName: "", email: "", password: "", confirmPassword: "" },
    validateAddAdmin,
  );

  if (!user?.isSuperAdmin) {
    return (
      <View style={styles.blocked}>
        <Text style={styles.blockedText}>
          Only the Super Admin can add new admins.
        </Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await createAdmin({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      reset();
      Alert.alert(
        "Admin created",
        "The new admin can now log in with the email and password you set.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        "Could not create admin",
        err.response?.data?.message || err.message || "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add New Admin</Text>
        <Text style={styles.subtitle}>
          Only you (the Super Admin) can create admin accounts. Give this person
          their email and password to log in with.
        </Text>

        <InputField
          label="Full Name"
          placeholder="e.g. Jane Doe"
          value={values.fullName}
          onChangeText={(v) => handleChange("fullName", v)}
          error={errors.fullName}
        />
        <InputField
          label="AIUB Email"
          placeholder="jane.doe@aiub.edu"
          value={values.email}
          onChangeText={(v) => handleChange("email", v)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          placeholder="••••••••"
          value={values.password}
          onChangeText={(v) => handleChange("password", v)}
          error={errors.password}
          secureTextEntry
          helperText="Min 8 chars, 1 capital letter, 1 number"
        />
        <InputField
          label="Confirm Password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChangeText={(v) => handleChange("confirmPassword", v)}
          error={errors.confirmPassword}
          secureTextEntry
        />

        <PrimaryButton
          title="Create Admin"
          onPress={handleSubmit}
          loading={submitting}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 20 },
  blocked: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  blockedText: { color: "#c62828", fontWeight: "600", textAlign: "center" },
});
