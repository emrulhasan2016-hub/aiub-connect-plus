import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const myPosts = state.posts.filter((p) => p.userId === user.id);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView>
        <Image source={{ uri: user.cover }} style={styles.cover} />
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.SETTINGS)}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.avatarRow}>
            <ProfileAvatar uri={user.avatar} size={sizes.avatarLg} />
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
              <Text style={styles.statNum}>{user.followers.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{user.following.length}</Text>
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
                liked={p.likedBy.includes(user.id)}
                commentCount={
                  state.comments.filter((c) => c.postId === p.id).length
                }
                onLike={() =>
                  dispatch({
                    type: "TOGGLE_LIKE",
                    payload: { postId: p.id, userId: user.id },
                  })
                }
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
  topBar: { position: "absolute", top: 44, right: 14 },
  settingsBtn: {
    backgroundColor: "rgba(0,0,0,0.35)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
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
