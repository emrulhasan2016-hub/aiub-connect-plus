// components/RoleBadge.js
// Used in Home Feed, Comments, Chat, Search Results, Profiles, Group Members, Notifications.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const roleColor = { Student: colors.student, Faculty: colors.faculty, Alumni: colors.alumni, Admin: colors.admin };

export default function RoleBadge({ role, size = "sm" }) {
  const color = roleColor[role] || colors.muted;
  return (
    <View style={[styles.badge, { backgroundColor: color + "22" }, size === "lg" && styles.lg]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === "lg" && styles.textLg]}>{role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start", gap: 4 },
  lg: { paddingHorizontal: 12, paddingVertical: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: fonts.size.xs, fontWeight: fonts.weight.bold, textTransform: "uppercase" },
  textLg: { fontSize: fonts.size.sm },
});
