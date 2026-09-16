import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "../../components/ProfileAvatar";
import RoleBadge from "../../components/RoleBadge";
import PostCard from "../../components/PostCard";
import useAuth from "../../hooks/useAuth";
import useApp from "../../hooks/useApp";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import sizes from "../../constants/sizes";
import routes from "../../constants/routes";

export default function ProfileScreen({ navigation }) {
  const { user, refreshProfile } = useAuth();
  const { state, toggleLike, fetchPosts, fetchNotifications } = useApp();
  const myPosts = (state.posts || []).filter((p) => p.userId === user.id);
  const unreadCount = (state.notifications || []).filter((n) => !n.read).length;

  useEffect(() => {
    refreshProfile().catch(() => {});

    fetchPosts();
    fetchNotifications();
  }, []);

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
    } catch (err) {
      Alert.alert("Could not update like", err.message || "Please try again.");
    }
  };

  const avatarUri = user.avatar || user.avatarUrl || null;
  const coverUri = user.cover || user.coverUrl || null;
  const followersCount = (user.followers || []).length;
  const followingCount = (user.following || []).length;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView>
        <Image source={{ uri: coverUri }} style={styles.cover} />
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.NOTIFICATIONS)}
            style={[styles.settingsBtn, { marginRight: 10 }]}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.white}
            />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.SETTINGS)}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.avatarRow}>
            <ProfileAvatar uri={avatarUri} size={sizes.avatarLg} />
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(routes.EDIT_PROFILE)}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.name}>{user.fullName}</Text>
            <RoleBadge role={user.role} size="lg" />
          </View>
          <Text style={styles.username}>
            @{user.username} · {user.department}
          </Text>
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{myPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>

          {user.role === "Admin" && (
            <TouchableOpacity
              style={styles.adminBtn}
              onPress={() => navigation.navigate(routes.ADMIN_DASHBOARD)}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={colors.white}
              />
              <Text style={styles.adminBtnText}>Open Admin Dashboard</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>My Posts</Text>
          {myPosts.length === 0 ? (
            <Text style={styles.emptyText}>
              You haven't posted anything yet.
            </Text>
          ) : (
            myPosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                author={user}
                liked={p.likedByMe}
                commentCount={p.commentCount}
                onLike={() => handleLike(p.id)}
                onComment={() => {}}
                onPress={() => {}}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { width: "100%", height: 140, backgroundColor: colors.gray200 },
  topBar: { position: "absolute", top: 44, right: 14, flexDirection: "row" },
  settingsBtn: {
    backgroundColor: "rgba(0,0,0,0.35)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fonts.weight.bold,
  },
  body: { padding: 16, marginTop: -40 },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  editBtn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  editBtnText: {
    color: colors.navy,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.sm,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  name: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.extrabold,
    color: colors.navyDark,
  },
  username: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 3 },
  bio: {
    fontSize: fonts.size.sm,
    color: colors.text,
    marginTop: 10,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNum: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.extrabold,
    color: colors.navyDark,
  },
  statLabel: { fontSize: fonts.size.xs, color: colors.muted, marginTop: 2 },
  adminBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.admin,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  adminBtnText: {
    color: colors.white,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.sm,
  },
  sectionTitle: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginTop: 24,
    marginBottom: 10,
  },
  emptyText: { fontSize: fonts.size.sm, color: colors.muted },
});
