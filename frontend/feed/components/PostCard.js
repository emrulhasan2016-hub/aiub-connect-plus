// components/PostCard.js
// Used by Member 2 (Home Feed). Displays: avatar, name, role badge, department,
// time, category, content, optional image, like/comment/share counts.
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "./ProfileAvatar";
import RoleBadge from "./RoleBadge";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";
import { timeAgo } from "../utils/time";

export default function PostCard({ post, author, onPress, onLike, onComment, liked, commentCount }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <ProfileAvatar uri={author?.avatar} size={sizes.avatarSm} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{author?.fullName}</Text>
            <RoleBadge role={author?.role} />
          </View>
          <Text style={styles.meta}>{author?.department} · {timeAgo(post.createdAt)}</Text>
        </View>
      </View>
      <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>{post.category}</Text>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {post.image ? <Image source={{ uri: post.image }} style={styles.postImage} /> : null}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? colors.danger : colors.muted} />
          <Text style={styles.actionText}>{post.likedBy.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={17} color={colors.muted} />
          <Text style={styles.actionText}>{commentCount ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="share-outline" size={18} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: sizes.radiusMd, padding: 14, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontWeight: fonts.weight.bold, fontSize: fonts.size.base, color: colors.text },
  meta: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 2 },
  categoryChip: { alignSelf: "flex-start", backgroundColor: colors.goldLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 10, marginBottom: 6 },
  categoryText: { fontSize: fonts.size.xs, color: colors.goldDark, fontWeight: fonts.weight.bold },
  content: { fontSize: fonts.size.base, color: colors.text, lineHeight: 20 },
  postImage: { width: "100%", height: 180, borderRadius: sizes.radiusSm, marginTop: 10 },
  footer: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 20 },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { fontSize: fonts.size.sm, color: colors.muted },
});
