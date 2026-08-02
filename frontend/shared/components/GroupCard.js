// components/GroupCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

export default function GroupCard({ group, onPress, joined, onToggleJoin }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: group.cover }} style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
        <Text style={styles.meta}>{group.memberIds.length} members · {group.category}</Text>
        <TouchableOpacity style={[styles.joinBtn, joined && styles.joinedBtn]} onPress={onToggleJoin}>
          <Text style={[styles.joinText, joined && styles.joinedText]}>{joined ? "Joined" : "Join"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 16, marginBottom: 12, overflow: "hidden" },
  cover: { width: "100%", height: 90 },
  body: { padding: 12 },
  name: { fontWeight: fonts.weight.bold, fontSize: fonts.size.base, color: colors.text },
  meta: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 3, marginBottom: 10 },
  joinBtn: { alignSelf: "flex-start", backgroundColor: colors.navy, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  joinedBtn: { backgroundColor: colors.gray200 },
  joinText: { color: colors.white, fontSize: fonts.size.xs, fontWeight: fonts.weight.bold },
  joinedText: { color: colors.navy },
});
