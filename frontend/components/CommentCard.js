// components/CommentCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfileAvatar from "./ProfileAvatar";
import RoleBadge from "./RoleBadge";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";
import { timeAgo } from "../utils/time";

export default function CommentCard({ comment, author, isReply }) {
  return (
    <View style={[styles.wrap, isReply && styles.replyWrap]}>
      <ProfileAvatar uri={author?.avatar} size={sizes.avatarSm - (isReply ? 8 : 0)} />
      <View style={styles.bubble}>
        <View style={styles.row}>
          <Text style={styles.name}>{author?.fullName}</Text>
          <RoleBadge role={author?.role} />
        </View>
        <Text style={styles.text}>{comment.text}</Text>
        <Text style={styles.time}>{timeAgo(comment.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", marginBottom: 12 },
  replyWrap: { marginLeft: 34, marginTop: 8, marginBottom: 0 },
  bubble: { marginLeft: 10, flex: 1, backgroundColor: colors.panel, borderRadius: sizes.radiusSm, padding: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontWeight: fonts.weight.bold, fontSize: fonts.size.sm, color: colors.text },
  text: { fontSize: fonts.size.base, color: colors.text, marginTop: 4 },
  time: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 4 },
});
