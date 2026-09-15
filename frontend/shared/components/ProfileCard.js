// components/ProfileCard.js
// Compact user row card --- used in Search results and Admin User Management (Member 4).
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProfileAvatar from "./ProfileAvatar";
import RoleBadge from "./RoleBadge";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

export default function ProfileCard({ user, onPress, rightSlot }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <ProfileAvatar uri={user.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.meta}>@{user.username} · {user.department}</Text>
        <RoleBadge role={user.role} />
      </View>
      {rightSlot}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 16, padding: 12, marginBottom: 10 },
  name: { fontWeight: fonts.weight.bold, fontSize: fonts.size.base, color: colors.text },
  meta: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 2, marginBottom: 5 },
});
