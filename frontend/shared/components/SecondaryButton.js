// components/SecondaryButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";

export default function SecondaryButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: sizes.radiusSm,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  text: { color: colors.navy, fontWeight: fonts.weight.bold, fontSize: fonts.size.base },
});
