// components/ProfileAvatar.js
import React from "react";
import { Image, StyleSheet } from "react-native";
import colors from "../constants/colors";
import sizes from "../constants/sizes";

export default function ProfileAvatar({ uri, size = sizes.avatarMd }) {
  return (
    <Image
      source={{ uri: uri || "https://i.pravatar.cc/150?img=1" }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: colors.gray200, borderWidth: 2, borderColor: colors.white },
});
