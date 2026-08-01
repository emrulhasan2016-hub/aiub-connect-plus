// screens/auth/LoginScreen.js
// Member 1 — FR2: Login validates AIUB email format and password (min 8 chars).
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validation";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { values, errors, handleChange, validateAll } = useForm(
    { email: "", password: "" },
    validateLogin
  );

  const handleLogin = async () => {
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      // RootNavigator automatically switches to MainTabs once `user` is set.
    } catch (err) {
      Alert.alert("Login failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Login with your AIUB email to continue.</Text>

        <View style={{ marginTop: 30 }}>
          <InputField
            label="AIUB Email"
            placeholder="yourname@aiub.edu"
            value={values.email}
            onChangeText={(v) => handleChange("email", v)}
            error={errors.email}
            keyboardType="email-address"
          />
          <InputField
            label="Password"
            placeholder="••••••••"
            value={values.password}
            onChangeText={(v) => handleChange("password", v)}
            error={errors.password}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>

          <PrimaryButton title="Login" onPress={handleLogin} loading={submitting} style={{ marginTop: 16 }} />

          <View style={styles.helperNote}>
            <Text style={styles.helperText}>Demo: rafiul.islam@aiub.edu / Rafiul123 (Student)</Text>
            <Text style={styles.helperText}>admin@aiub.edu / Admin123 (Admin)</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to AIUB Connect+? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(routes.REGISTER)}>
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white },
  title: { fontSize: fonts.size.xl, fontWeight: fonts.weight.extrabold, color: colors.navyDark },
  subtitle: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 6 },
  link: { color: colors.navy, fontWeight: fonts.weight.semibold, fontSize: fonts.size.sm, marginBottom: 4, textAlign: "right" },
  helperNote: { marginTop: 16, backgroundColor: colors.panel, padding: 10, borderRadius: 10 },
  helperText: { fontSize: fonts.size.xs, color: colors.muted },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: colors.muted, fontSize: fonts.size.sm },
  footerLink: { color: colors.navy, fontWeight: fonts.weight.bold, fontSize: fonts.size.sm },
});
