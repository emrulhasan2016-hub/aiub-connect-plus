import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            secureTextEntry && { paddingRight: 44 },
            multiline && { height: 100, textAlignVertical: "top" },
            focused && styles.inputFocused,
            error && styles.inputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray500}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType || "default"}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setHidden((p) => !p)}
          >
            <Ionicons
              name={hidden ? "eye-off" : "eye"}
              size={20}
              color={colors.gray500}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    color: colors.text,
    marginBottom: 6,
  },
  inputWrapper: { position: "relative", justifyContent: "center" },
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
  eyeButton: { position: "absolute", right: 12, padding: 4 },
  inputFocused: { borderColor: colors.navy },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: fonts.size.xs, marginTop: 4 },
  helperText: { color: colors.muted, fontSize: fonts.size.xs, marginTop: 4 },
});
