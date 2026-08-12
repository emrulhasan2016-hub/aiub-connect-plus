import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function GroupDetailsScreen({ route, navigation }) {
  const { groupId } = route.params;
  const { state, dispatch } = useApp();
  const { user, users } = useAuth();

  const group = state.groups.find((g) => g.id === groupId);
  if (!group) {
    return (
      <View style={styles.center}>
        <Text>Group not found.</Text>
      </View>
    );
  }

  const isMember = group.memberIds.includes(user.id);
  const members = users.filter((u) => group.memberIds.includes(u.id));
  const handleToggleMembership = () => {
    dispatch({
      type: "TOGGLE_GROUP_MEMBERSHIP",
      payload: { groupId: group.id, userId: user.id },
    });
    Alert.alert(
      "Success",
      isMember ? "You left the group." : "You joined the group!",
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: group.cover }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.category}>{group.category}</Text>
        <Text style={styles.name}>{group.name}</Text>
        <Text style={styles.description}>{group.description}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.btn,
              isMember ? styles.btnOutline : styles.btnPrimary,
            ]}
            onPress={handleToggleMembership}
          >
            <Text style={[styles.btnText, isMember && styles.btnOutlineText]}>
              {isMember ? "Leave Group" : "Join Group"}
            </Text>
          </TouchableOpacity>
          {isMember && (
            <TouchableOpacity
              style={[styles.btn, styles.btnChat]}
              onPress={() =>
                navigation.navigate(routes.GROUP_CHAT, { groupId: group.id })
              }
            >
              <Ionicons
                name="chatbubbles-outline"
                size={18}
                color={colors.white}
              />
              <Text style={styles.btnText}>Group Chat</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members ({members.length})</Text>
          {members.map((m) => (
            <View key={m.id} style={styles.memberCard}>
              <Image source={{ uri: m.avatar }} style={styles.avatar} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{m.fullName}</Text>
                <Text style={styles.memberRole}>
                  {m.role} • {m.department}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  cover: { width: "100%", height: 180 },
  content: { padding: spacing.lg },
  category: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.bold,
    color: colors.goldDark,
  },
  name: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginVertical: spacing.xs,
  },
  description: {
    fontSize: fonts.size.base,
    color: colors.text,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: sizes.radiusSm,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  btnPrimary: { backgroundColor: colors.navy },
  btnOutline: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  btnChat: { backgroundColor: colors.goldDark },
  btnText: {
    color: colors.white,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.base,
  },
  btnOutlineText: { color: colors.danger },
  section: { marginTop: spacing.md },
  sectionTitle: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginBottom: spacing.md,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: sizes.radiusSm,
    marginBottom: spacing.sm,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: spacing.md },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: fonts.size.base,
    fontWeight: fonts.weight.semibold,
    color: colors.navyDark,
  },
  memberRole: { fontSize: fonts.size.xs, color: colors.muted },
});
