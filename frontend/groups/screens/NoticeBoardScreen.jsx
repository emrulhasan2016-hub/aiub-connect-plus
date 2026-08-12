import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import fonts from "../../constants/fonts";

export default function NoticeDetailsScreen({ route }) {
  const { noticeId } = route.params;
  const { state } = useApp();
  const { users } = useAuth();

  const notice = state.notices.find((n) => n.id === noticeId);
  if (!notice) {
    return (
      <View style={styles.center}>
        <Text>Notice not found.</Text>
      </View>
    );
  }
  const author = users.find((u) => u.id === notice.userId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.category}>{notice.category}</Text>
      <Text style={styles.title}>{notice.title}</Text>
      {author && <Text style={styles.author}>Posted by {author.fullName}</Text>}
      <Text style={styles.content}>{notice.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  category: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    color: colors.goldDark,
    textTransform: "uppercase",
  },
  title: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginTop: spacing.xs,
  },
  author: {
    fontSize: fonts.size.sm,
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  content: { fontSize: fonts.size.base, color: colors.text, lineHeight: 22 },
});
