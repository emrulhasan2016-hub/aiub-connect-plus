// components/JobCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";

const typeColor = {
  Job: colors.navy,
  Internship: colors.success,
  Freelancing: colors.alumni,
  Scholarship: colors.gold,
};

export default function JobCard({ job, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.rowBetween}>
        <View style={[styles.typeChip, { backgroundColor: (typeColor[job.type] || colors.navy) + "22" }]}>
          <Text style={[styles.typeText, { color: typeColor[job.type] || colors.navy }]}>{job.type}</Text>
        </View>
        <Text style={styles.deadline}>Due {job.deadline}</Text>
      </View>
      <Text style={styles.position}>{job.position}</Text>
      <Text style={styles.company}>{job.company}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: sizes.radiusMd, padding: 14, marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  typeChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  typeText: { fontSize: fonts.size.xs, fontWeight: fonts.weight.bold },
  deadline: { fontSize: fonts.size.xs, color: colors.muted },
  position: { fontSize: fonts.size.base, fontWeight: fonts.weight.bold, color: colors.text, marginTop: 8 },
  company: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 2 },
});
