import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import ConfirmationModal from "../../components/ConfirmationModal";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

function SettingsRow({ icon, label, onPress, rightElement }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.navy}
        style={{ width: 28 }}
      />
      <Text style={styles.rowLabel}>{label}</Text>
      {rightElement || (
        <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifOn, setNotifOn] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="person-outline"
            label="Account Details"
            onPress={() => Alert.alert("Account", "Account details (mock).")}
          />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            rightElement={
              <Switch
                value={notifOn}
                onValueChange={setNotifOn}
                trackColor={{ true: colors.navy }}
              />
            }
          />
          <SettingsRow
            icon="moon-outline"
            label="Dark Mode"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ true: colors.navy }}
              />
            }
          />
          <SettingsRow
            icon="language-outline"
            label="Language"
            onPress={() => Alert.alert("Language", "English (default)")}
          />
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="information-circle-outline"
            label="About AIUB Connect+"
            onPress={() =>
              Alert.alert("About", "AIUB Connect+ v1.0.0 — Capstone Project")
            }
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Alert.alert("Terms", "Terms of Service (mock).")}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Privacy Policy"
            onPress={() => Alert.alert("Privacy", "Privacy Policy (mock).")}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setShowLogoutConfirm(true)}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmationModal
        visible={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of AIUB Connect+?"
        confirmLabel="Log Out"
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
    color: colors.muted,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8,
  },
  card: { backgroundColor: colors.white, borderRadius: 14, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  rowLabel: { flex: 1, fontSize: fonts.size.sm, color: colors.text },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    padding: 14,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.base,
  },
});
