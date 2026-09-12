// components/EmptyState.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

export default function EmptyState({ icon = "file-tray-outline", title = "Nothing here yet", subtitle }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={48} color={colors.gray500} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 24 },
  title: { marginTop: 12, fontWeight: fonts.weight.bold, color: colors.text, fontSize: fonts.size.md },
  subtitle: { marginTop: 4, color: colors.muted, fontSize: fonts.size.sm, textAlign: "center" },
});
