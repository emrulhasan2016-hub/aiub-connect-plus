// components/Loading.js
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

export default function Loading({ text = "Loading..." }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.navy} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  text: { marginTop: 10, color: colors.muted, fontSize: fonts.size.sm },
});
