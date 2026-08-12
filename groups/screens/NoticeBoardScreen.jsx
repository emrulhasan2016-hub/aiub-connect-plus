import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import useApp from "../../hooks/useApp";
import NoticeCard from "../../components/NoticeCard";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

const CATEGORIES = ["All", "Academic", "Exam", "Assignment", "Seminar", "Workshop"];

export default function NoticeBoardScreen({ navigation }) {
  const { state } = useApp();
  const [filter, setFilter] = useState("All");

  const notices = state.notices.filter(
    (n) => filter === "All" || n.category === filter
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, filter === item && styles.chipActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notices in this category yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <NoticeCard
            notice={item}
            onPress={() =>
              navigation.navigate(routes.NOTICE_DETAILS, { noticeId: item.id })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { padding: spacing.md, backgroundColor: colors.white },
  chip: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: fonts.size.xs, color: colors.text },
  chipTextActive: { color: colors.white, fontWeight: fonts.weight.bold },
  list: { padding: spacing.md },
  emptyContainer: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: colors.muted, fontSize: fonts.size.sm },
});
