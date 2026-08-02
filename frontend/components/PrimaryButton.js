// components/PrimaryButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";

export default function PrimaryButton({ title, onPress, loading, disabled, style }) {
  return (
    <TouchableOpacity
      style={[styles.btn, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.navy,
    borderRadius: sizes.radiusSm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontWeight: fonts.weight.bold, fontSize: fonts.size.base },
});
