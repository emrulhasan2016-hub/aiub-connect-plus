// Member 2 --- FR9: filtering by All/Students/Faculty/Alumni/Groups with loading and empty states.
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";
import ProfileCard from "../../components/ProfileCard";
import GroupCard from "../../components/GroupCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import useApp from "../../hooks/useApp";
import { searchUsersApi } from "../../api/users.api";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

const FILTERS = ["All", "Students", "Faculty", "Alumni", "Groups"];

export default function SearchScreen() {
  const { state, fetchGroups } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const matchesQuery = (text) =>
    text.toLowerCase().includes(query.toLowerCase());

  useEffect(() => {
    if (state.groupsStatus === "idle") fetchGroups();
  }, [state.groupsStatus, fetchGroups]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchUsersApi(query);
        if (!cancelled) setUsers(results);
      } catch (err) {
        if (!cancelled) {
          setUsers([]);
          setError("Could not search right now. Check your connection.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const filteredUsers = users.filter((u) => {
    if (filter === "Groups") return false;
    if (filter !== "All" && u.role !== filter.replace(/s$/, "")) return false;
    return true;
  });

  const filteredGroups =
    filter === "All" || filter === "Groups"
      ? state.groups.filter((g) => query === "" || matchesQuery(g.name))
      : [];

  const results =
    filter === "Groups"
      ? filteredGroups
      : filter === "All"
        ? [...filteredUsers, ...filteredGroups]
        : filteredUsers;

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={{ padding: 14 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search students, faculty, alumni, groups..."
        />
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[styles.chipText, filter === f && styles.chipTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading ? (
        <Loading text="Searching..." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          ListEmptyComponent={
            error ? (
              <EmptyState
                icon="cloud-offline-outline"
                title="Search unavailable"
                subtitle={error}
              />
            ) : (
              <EmptyState
                icon="search-outline"
                title="No results"
                subtitle="Try a different name or filter."
              />
            )
          }
          renderItem={({ item }) =>
            item.memberIds ? (
              <GroupCard
                group={item}
                joined={false}
                onPress={() => {}}
                onToggleJoin={() => {}}
              />
            ) : (
              <ProfileCard user={item} onPress={() => {}} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
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
});
