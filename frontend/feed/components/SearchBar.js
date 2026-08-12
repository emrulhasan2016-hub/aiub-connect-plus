// components/SearchBar.js
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import sizes from "../constants/sizes";
import fonts from "../constants/fonts";

export default function SearchBar({ value, onChangeText, placeholder = "Search..." }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={sizes.iconSm} color={colors.gray500} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.gray300,
    gap: 8,
  },
  input: { flex: 1, fontSize: fonts.size.base, color: colors.text },
});
