// screens/auth/ForgotPasswordScreen.js
// Member 1 — FR4: validates required AIUB email and calls the real backend.
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validateForgotPassword } from "../../utils/validation";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { values, errors, handleChange, validateAll } = useForm({ email: "" }, validateForgotPassword);

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await forgotPassword(values.email);
      Alert.alert(
        "Check your email",
        "If an account exists for this email, a password reset link has been sent.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert("Request failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20 }}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 24 }}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your AIUB email and we'll send reset instructions.</Text>

        <View style={{ marginTop: 24 }}>
          <InputField
            label="AIUB Email"
            placeholder="yourname@aiub.edu"
            value={values.email}
            onChangeText={(v) => handleChange("email", v)}
            error={errors.email}
            keyboardType="email-address"
          />
          <PrimaryButton title="Send Reset Link" onPress={handleSubmit} loading={submitting} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white },
  back: { color: colors.navy, fontWeight: fonts.weight.semibold },
  title: { fontSize: fonts.size.xl, fontWeight: fonts.weight.extrabold, color: colors.navyDark },
  subtitle: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 6 },
});
