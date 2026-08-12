import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import GroupCard from "../components/GroupCard";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function GroupsScreen({ navigation }) {
  const { state } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my");
  const [search, setSearch] = useState("");

  const myGroups = state.groups.filter((g) => g.memberIds.includes(user.id));
  const discoverGroups = state.groups.filter(
    (g) => !g.memberIds.includes(user.id),
  );

  const listToDisplay = (activeTab === "my" ? myGroups : discoverGroups).filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.portalBar}>
        <TouchableOpacity
          style={styles.portalButton}
          onPress={() => navigation.navigate(routes.NOTICE_BOARD)}
        >
          <Ionicons name="mega-outline" size={20} color={colors.white} />
          <Text style={styles.portalText}>Notice Board</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.portalButton, { backgroundColor: colors.goldDark }]}
          onPress={() => navigation.navigate(routes.JOB_PORTAL)}
        >
          <Ionicons name="briefcase-outline" size={20} color={colors.white} />
          <Text style={styles.portalText}>Job & Alumni Portal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "my" && styles.activeTab]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.activeTabText]}
          >
            My Groups ({myGroups.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "discover" && styles.activeTab]}
          onPress={() => setActiveTab("discover")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "discover" && styles.activeTabText,
            ]}
          >
            Discover ({discoverGroups.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listToDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            isMember={item.memberIds.includes(user.id)}
            onPress={() =>
              navigation.navigate(routes.GROUP_DETAILS, { groupId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.gray500} />
            <Text style={styles.emptyText}>No groups found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  portalBar: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  portalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.navy,
    paddingVertical: spacing.md,
    borderRadius: sizes.radiusSm,
  },
  portalText: {
    color: colors.white,
    fontWeight: fonts.weight.semibold,
    fontSize: fonts.size.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: sizes.radiusSm,
    paddingHorizontal: spacing.md,
    height: 42,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: fonts.size.base },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.gray200,
    borderRadius: sizes.radiusSm,
    padding: 3,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: sizes.radiusSm,
  },
  activeTab: { backgroundColor: colors.white },
  tabText: {
    fontSize: fonts.size.sm,
    color: colors.muted,
    fontWeight: fonts.weight.medium,
  },
  activeTabText: { color: colors.navyDark, fontWeight: fonts.weight.bold },
  listContent: { paddingBottom: spacing.xl },
  emptyContainer: { alignItems: "center", marginTop: spacing.xxl },
  emptyText: {
    fontSize: fonts.size.base,
    color: colors.muted,
    marginTop: spacing.sm,
  },
});
