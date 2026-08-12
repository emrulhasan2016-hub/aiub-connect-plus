import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import NotificationCard from "../../components/NotificationCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

const CATEGORIES = [
  "All",
  "Like",
  "Comment",
  "Reply",
  "Group",
  "Notice",
  "Job",
];

export default function NotificationsScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");

  const myNotifications = state.notifications
    .filter((n) => n.recipientId === user.id)
    .filter((n) => filter === "All" || n.type === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const markAllRead = () =>
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ", payload: user.id });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <View style={styles.topRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
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
      <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>
      <FlatList
        data={myNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="You're all caught up"
            subtitle="No notifications in this category."
          />
        }
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() =>
              dispatch({ type: "MARK_NOTIFICATION_READ", payload: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
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
  markAllBtn: { alignSelf: "flex-end", paddingHorizontal: 16, paddingTop: 10 },
  markAllText: {
    color: colors.navy,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
  },
});
