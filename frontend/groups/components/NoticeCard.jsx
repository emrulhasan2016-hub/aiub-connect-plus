import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import spacing from "../constants/spacing";
import sizes from "../constants/sizes";
import fonts from "../constants/fonts";
import { timeAgo } from "../utils/time";
import useAuth from "../hooks/useAuth";

export default function NoticeCard({ notice, onPress }) {
const { users } = useAuth();
const publisher = users.find((u) => u.id === notice.userId);
return (
<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
<View style={styles.header}>
<View style={styles.categoryBadge}>
<Text style={styles.categoryText}>{notice.category}</Text>
</View>
<Text style={styles.timeText}>{timeAgo(notice.createdAt)}</Text>
</View>

<Text style={styles.title} numberOfLines={2}>
        {notice.title}
</Text>

<Text style={styles.content} numberOfLines={2}>
        {notice.content}
</Text>

<View style={styles.footer}>
<Text style={styles.publisherText}>
 By {publisher ? publisher.fullName : "Faculty/Admin"}
</Text>
{notice.attachments && notice.attachments.length > 0 && (
<View style={styles.attachmentBadge}>
<Ionicons name="document-attach-outline" size={14} color={colors.navy} />
<Text style={styles.attachmentText}>{notice.attachments.length} attachment(s)</Text>
 </View>
 )}
</View>
</TouchableOpacity>
);
}
const styles = StyleSheet.create({
card: {
backgroundColor: colors.white,
borderRadius: sizes.radiusMd,
 padding: spacing.lg,
marginBottom: spacing.md,
 elevation: 2,
shadowColor: colors.navyDark,
shadowOpacity: 0.06,
shadowRadius: 8,
shadowOffset: { width: 0, height: 3 },
  },
 header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
 marginBottom: spacing.sm,
},
categoryBadge: {
backgroundColor: colors.goldLight,
paddingHorizontal: spacing.sm,
paddingVertical: 3,
 borderRadius: sizes.radiusSm,
},
categoryText: {
fontSize: fonts.size.xs,
fontWeight: fonts.weight.bold,
 color: colors.goldDark,
 },
timeText: {
fontSize: fonts.size.xs,
color: colors.muted,
},
title: {
fontSize: fonts.size.md,
fontWeight: fonts.weight.bold,
color: colors.navyDark,
 marginBottom: spacing.xs,
},
content: {
fontSize: fonts.size.base,
color: colors.text,
 lineHeight: 18,
marginBottom: spacing.md,
},
footer: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
 borderTopWidth: 1,
 borderTopColor: colors.gray200,
paddingTop: spacing.sm,
},
publisherText: {
fontSize: fonts.size.sm,
color: colors.muted,
fontWeight: fonts.weight.medium,
},
attachmentBadge: {
flexDirection: "row",
 alignItems: "center",
 gap: 4,
},
attachmentText: {
fontSize: fonts.size.xs,
color: colors.navy,
 fontWeight: fonts.weight.medium,
},
});