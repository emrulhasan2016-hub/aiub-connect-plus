// components/ErrorState.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import PrimaryButton from "./PrimaryButton";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onRetry ? <PrimaryButton title="Try Again" onPress={onRetry} style={{ marginTop: 14, paddingHorizontal: 30 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 24 },
  text: { marginTop: 12, color: colors.text, fontSize: fonts.size.base, textAlign: "center" },
});
