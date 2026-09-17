import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import useApp from "../../hooks/useApp";
import NoticeCard from "../../components/NoticeCard";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

const CATEGORIES = [
  "All",
  "Academic",
  "Exam",
  "Assignment",
  "Seminar",
  "Workshop",
];

export default function NoticeBoardScreen({ navigation }) {
  const { state, fetchNotices } = useApp();
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotices();
    setRefreshing(false);
  }, [fetchNotices]);

  const notices = state.notices.filter(
    (n) => filter === "All" || n.category === filter,
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
              <Text
                style={[
                  styles.chipText,
                  filter === item && styles.chipTextActive,
                ]}
              >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          state.noticesStatus === "loading" ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={colors.navy} />
            </View>
          ) : state.noticesStatus === "error" ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {state.noticesError || "Could not load notices."}
              </Text>
              <TouchableOpacity onPress={fetchNotices}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No notices in this category yet.
              </Text>
            </View>
          )
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
  retryText: {
    color: colors.navy,
    fontSize: fonts.size.sm,
    marginTop: spacing.sm,
    fontWeight: "600",
    textAlign: "center",
  },
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
