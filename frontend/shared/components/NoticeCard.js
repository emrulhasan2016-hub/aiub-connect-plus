// components/NoticeCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { timeAgo } from "../utils/time";

const categoryIcon = {
  Academic: "school-outline", Exam: "document-text-outline", Assignment: "create-outline",
  Seminar: "mic-outline", Workshop: "construct-outline",
};

export default function NoticeCard({ notice, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Ionicons name={categoryIcon[notice.category] || "megaphone-outline"} size={18} color={colors.navy} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title} numberOfLines={1}>{notice.title}</Text>
        <Text style={styles.meta}>{notice.category} · {timeAgo(notice.createdAt)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.goldLight, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: fonts.weight.bold, fontSize: fonts.size.base, color: colors.text },
  meta: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 3 },
});
