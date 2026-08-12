import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import spacing from "../constants/spacing";
import sizes from "../constants/sizes";
import fonts from "../constants/fonts";

export default function GroupCard({ group, isMember, onPress }) {
    return(
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
   <Image source={{ uri: group.cover }} style={styles.cover} />
    <View style={styles.content}>
    <View style={styles.topRow}>
   <Text style={styles.category}>{group.category}</Text>
   {isMember && (
   <View style={styles.memberBadge}>
    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
   <Text style={styles.memberBadgeText}>Joined</Text>
    </View> 
    )}
   </View>
  <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
   <Text style={styles.description} numberOfLines={2}>{group.description}</Text>
  <View style={styles.footer}>
   <View style={styles.membersCount}>
   <Ionicons name="people-outline" size={16} color={colors.muted} />
   <Text style={styles.membersText}>{group.memberIds.length} Members</Text>
 </View>
  <Ionicons name="chevron-forward" size={18} color={colors.navy} />
   </View>
   </View>
   </TouchableOpacity>
   );
}
const styles = StyleSheet.create({
card: {
backgroundColor: colors.white,
borderRadius: sizes.radiusMd,
marginBottom: spacing.md,
overflow: "hidden",
elevation: 2,
shadowColor: colors.navyDark,
shadowOpacity: 0.06,
shadowRadius: 8,
shadowOffset: { width: 0, height: 4 },   
},
 cover: {
width: "100%",
 height: 100,
  }, 
content: {
padding: spacing.md,
  },
  topRow: {
 flexDirection: "row",
justifyContent: "space-between",
  alignItems: "center",
 marginBottom: spacing.xs,
  },
  category: {
 fontSize: fonts.size.xs,
 fontWeight: fonts.weight.bold,
 color: colors.goldDark,
textTransform: "uppercase",
  },
 memberBadge: {
 flexDirection: "row",
 alignItems: "center",
 gap: 2,
  },
memberBadgeText: {
 fontSize: fonts.size.xs,
color: colors.success,
 fontWeight: fonts.weight.semibold,
  },
name: {
 fontSize: fonts.size.md,
 fontWeight: fonts.weight.bold,
 color: colors.navyDark,
  },
description: {
fontSize: fonts.size.sm,
 color: colors.muted,
 marginVertical: spacing.xs,
  },
 footer: {
flexDirection: "row",
 justifyContent: "space-between",
alignItems: "center",
marginTop: spacing.sm,
 paddingTop: spacing.xs,
borderTopWidth: 1,
 borderTopColor: colors.gray200,
  },
  membersCount: {
 flexDirection: "row",
 alignItems: "center",
 gap: 6,
  },
  membersText: {
 fontSize: fonts.size.xs,
color: colors.muted,
fontWeight: fonts.weight.medium,
  },
});    