// components/Header.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";

export default function Header({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.wrap}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={sizes.iconMd} color={colors.navyDark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={sizes.iconMd} color={colors.navyDark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, textAlign: "center", fontSize: fonts.size.md, fontWeight: fonts.weight.bold, color: colors.navyDark },
});
