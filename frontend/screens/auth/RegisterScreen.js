// screens/auth/RegisterScreen.js
// Member 1 — FR3: Register validates Full Name, Username, AIUB email, Department,
// ID, Role, Password, Confirm Password.
//
// NOTE: adapted from the guide's version. The real AuthContext has no register() and no
// `users` array to append to, so this screen checks duplicates against the static
// data/users.js list, "creates" the account in memory, and logs the person straight in
// via setUser(). Because there's nowhere shared to persist the new account, it won't be
// findable again after the app reloads — worth flagging to whoever owns AuthContext.js if
// FR3 needs to survive navigation away and back.
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validateRegister } from "../../utils/validation";
import usersData from "../../data/users";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

const ROLES = ["Student", "Faculty", "Alumni"]; // Admin accounts are created manually, not self-registered

export default function RegisterScreen({ navigation }) {
  const { setUser, loading, setLoading } = useAuth();
  const { values, errors, handleChange, validateAll } = useForm(
    {
      fullName: "", username: "", email: "", department: "",
      studentId: "", role: "Student", password: "", confirmPassword: "",
    },
    validateRegister
  );

  const handleRegister = () => {
    if (!validateAll()) return;

    const exists = usersData.some(
      (u) => u.email.toLowerCase() === values.email.trim().toLowerCase()
    );
    if (exists) {
      Alert.alert("Registration failed", "An account with this AIUB email already exists.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const created = {
        id: "u" + (usersData.length + 1),
        followers: [],
        following: [],
        status: "active",
        bio: "",
        ...values,
      };
      setLoading(false);
      Alert.alert("Account created", "You're now logged in.", [
        { text: "OK", onPress: () => setUser(created) },
      ]);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Only verified AIUB members can join.</Text>

        <View style={{ marginTop: 24 }}>
          <InputField label="Full Name" placeholder="e.g. Rafiul Islam" value={values.fullName}
            onChangeText={(v) => handleChange("fullName", v)} error={errors.fullName} />
          <InputField label="Username" placeholder="e.g. rafiul_cse" value={values.username}
            onChangeText={(v) => handleChange("username", v)} error={errors.username} />
          <InputField label="AIUB Email" placeholder="yourname@aiub.edu" value={values.email}
            onChangeText={(v) => handleChange("email", v)} error={errors.email} keyboardType="email-address" />
          <InputField label="Department" placeholder="e.g. CSE" value={values.department}
            onChangeText={(v) => handleChange("department", v)} error={errors.department} />
          <InputField label="Student / Employee ID" placeholder="e.g. 21-12345-1" value={values.studentId}
            onChangeText={(v) => handleChange("studentId", v)} error={errors.studentId} />

          <Text style={styles.label}>Role</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, values.role === r && styles.roleChipActive]}
                onPress={() => handleChange("role", r)}
              >
                <Text style={[styles.roleChipText, values.role === r && styles.roleChipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

          <InputField label="Password" placeholder="••••••••" value={values.password}
            onChangeText={(v) => handleChange("password", v)} error={errors.password} secureTextEntry
            helperText="Min 8 chars, 1 capital letter, 1 number" />
          <InputField label="Confirm Password" placeholder="••••••••" value={values.confirmPassword}
            onChangeText={(v) => handleChange("confirmPassword", v)} error={errors.confirmPassword} secureTextEntry />

          <PrimaryButton title="Register" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace(routes.LOGIN)}>
            <Text style={styles.footerLink}>Login</Text>
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
  label: { fontSize: fonts.size.sm, fontWeight: fonts.weight.semibold, color: colors.text, marginBottom: 6 },
  roleRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  roleChip: { borderWidth: 1, borderColor: colors.gray300, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  roleChipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  roleChipText: { fontSize: fonts.size.sm, color: colors.text },
  roleChipTextActive: { color: colors.white, fontWeight: fonts.weight.bold },
  errorText: { color: colors.danger, fontSize: fonts.size.xs, marginBottom: 10 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 20, marginBottom: 10 },
  footerText: { color: colors.muted, fontSize: fonts.size.sm },
  footerLink: { color: colors.navy, fontWeight: fonts.weight.bold, fontSize: fonts.size.sm },
});
