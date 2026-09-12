// components/NotificationCard.js
// Used by Member 4 (Notifications screen).
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";
import { timeAgo } from "../utils/time";

const typeIcon = {
  Like: "heart",
  Comment: "chatbubble",
  Reply: "arrow-undo",
  Group: "people",
  Notice: "megaphone",
  Job: "briefcase",
};

const typeColor = {
  Like: colors.danger,
  Comment: colors.navy,
  Reply: colors.alumni,
  Group: colors.faculty,
  Notice: colors.gold,
  Job: colors.success,
};

export default function NotificationCard({ notification, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, !notification.read && styles.unread]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrap, { backgroundColor: (typeColor[notification.type] || colors.navy) + "22" }]}>
        <Ionicons name={typeIcon[notification.type] || "notifications"} size={16} color={typeColor[notification.type] || colors.navy} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.text}>{notification.text}</Text>
        <Text style={styles.time}>{timeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.read ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: sizes.radiusMd, padding: 13, marginBottom: 8 },
  unread: { backgroundColor: colors.panel },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  text: { fontSize: fonts.size.sm, color: colors.text },
  time: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 3 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginLeft: 8 },
});
