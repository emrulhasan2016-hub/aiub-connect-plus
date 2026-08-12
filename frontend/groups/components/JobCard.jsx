import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import spacing from "../constants/spacing";
import sizes from "../constants/sizes";
import fonts from "../constants/fonts";

export default function JobCard({ job, onPress }) {
const getTypeColor = (type) => {
 switch (type) {
 case "Job":
return colors.student;
case "Internship":
 return colors.success;
case "Scholarship":
return colors.goldDark;
case "Freelancing":
return colors.faculty;
default:
 return colors.navy;
}
};

return (
<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
<View style={styles.row}>
<View style={styles.infoContainer}>
<View style={[styles.typeBadge, { backgroundColor: getTypeColor(job.type) + "1A" }]}>
<Text style={[styles.typeText, { color: getTypeColor(job.type) }]}>{job.type}</Text>
 </View>

 <Text style={styles.position} numberOfLines={1}>
{job.position}
 </Text>
<Text style={styles.company} numberOfLines={1}>
{job.company}
</Text>
</View>
</View>

<Text style={styles.description} numberOfLines={2}>
{job.description}
</Text>

<View style={styles.footer}>
 <View style={styles.deadlineBox}>
 <Ionicons name="calendar-outline" size={14} color={colors.muted} />
<Text style={styles.deadlineText}>Deadline: {job.deadline}</Text>
 </View>
 <Ionicons name="chevron-forward" size={18} color={colors.muted} />
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
shadowOpacity: 0.05,
shadowRadius: 6,
shadowOffset: { width: 0, height: 3 },
},
row: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "flex-start",
 },
infoContainer: {
flex: 1,
},
typeBadge: {
alignSelf: "flex-start",
paddingHorizontal: spacing.sm,
paddingVertical: 2,
borderRadius: sizes.radiusSm,
marginBottom: spacing.xs,
 },
typeText: {
fontSize: fonts.size.xs,
fontWeight: fonts.weight.bold,
 },
 position: {
fontSize: fonts.size.md,
fontWeight: fonts.weight.bold,
color: colors.navyDark,
},
company: {
fontSize: fonts.size.sm,
color: colors.muted,
marginBottom: spacing.xs,
},
description: {
fontSize: fonts.size.base,
color: colors.text,
marginVertical: spacing.sm,
lineHeight: 18,
 },
footer: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
borderTopWidth: 1,
borderTopColor: colors.gray200,
paddingTop: spacing.sm,
marginTop: spacing.xs,
},
deadlineBox: {
flexDirection: "row",
alignItems: "center",
 gap: 4,
},
deadlineText: {
fontSize: fonts.size.xs,
color: colors.muted,
},
});