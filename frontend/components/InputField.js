// components/InputField.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  maxLength,
  helperText,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: "top" },
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray500}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || "default"}
        multiline={multiline}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fonts.size.sm, fontWeight: fonts.weight.semibold, color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: sizes.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: fonts.size.base,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputFocused: { borderColor: colors.navy },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: fonts.size.xs, marginTop: 4 },
  helperText: { color: colors.muted, fontSize: fonts.size.xs, marginTop: 4 },
});
