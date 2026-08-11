import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApp from "../../hooks/useApp";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";

export default function JobDetailsScreen({ route }) {
  const { jobId } = route.params;
  const { state } = useApp();
  const job = state.jobs.find((j) => j.id === jobId);
  if (!job) return null;
  const handleApply = () => {
    if (job.applyLink) {
      Linking.openURL(job.applyLink).catch(() =>
        Alert.alert(
          "Application Sent",
          "Your application profile has been submitted.",
        ),
      );
    } else {
      Alert.alert(
        "Application Sent",
        "Your application profile has been submitted.",
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.type}>{job.type}</Text>
        <Text style={styles.position}>{job.position}</Text>
        <Text style={styles.company}>{job.company}</Text>

        <View style={styles.deadlineBox}>
          <Ionicons name="time-outline" size={16} color={colors.danger} />
          <Text style={styles.deadline}>Deadline: {job.deadline}</Text>
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.body}>{job.description}</Text>
        {job.requirements && (
          <>
            <Text style={styles.sectionHeader}>Requirements</Text>
            {job.requirements.map((req, idx) => (
              <View key={idx} style={styles.reqRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.success}
                />
                <Text style={styles.reqText}>{req}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: sizes.radiusMd,
  },
  type: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    color: colors.goldDark,
  },
  position: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginTop: 2,
  },
  company: {
    fontSize: fonts.size.md,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  deadlineBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  deadline: {
    fontSize: fonts.size.sm,
    color: colors.danger,
    fontWeight: fonts.weight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.lg,
  },
  sectionHeader: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: fonts.size.base,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.xs,
  },
  reqText: { fontSize: fonts.size.base, color: colors.text },
  applyBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: sizes.radiusSm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  applyBtnText: {
    color: colors.white,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.base,
  },
});
