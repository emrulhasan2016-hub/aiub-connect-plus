import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const ROLE_CYCLE = ["Student", "Faculty", "Alumni", "Admin"];

function nextRole(currentRole) {
  const idx = ROLE_CYCLE.indexOf(currentRole);
  return ROLE_CYCLE[(idx + 1) % ROLE_CYCLE.length];
}

export default function UserManagementScreen() {
  const { state, fetchAdminUsers, updateAdminUser } = useApp();
  const { user: actingAdmin } = useAuth();
  const [busyUserId, setBusyUserId] = useState(null);

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  if (state.adminUsersStatus === "loading" && state.adminUsers.length === 0) {
    return <Loading text="Loading users..." />;
  }

  if (state.adminUsersStatus === "error" && state.adminUsers.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorState message={state.adminUsersError} onRetry={fetchAdminUsers} />
      </View>
    );
  }

  const handleChangeRole = async (targetUser) => {
    setBusyUserId(targetUser.id);
    try {
      await updateAdminUser(targetUser.id, { role: nextRole(targetUser.role) });
    } catch (err) {
      Alert.alert("Could not change role", err.message || "Please try again.");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const nextStatus = targetUser.status === "banned" ? "active" : "banned";
    setBusyUserId(targetUser.id);
    try {
      await updateAdminUser(targetUser.id, { status: nextStatus });
    } catch (err) {
      Alert.alert(
        "Could not update status",
        err.message || "Please try again.",
      );
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User & Role Management</Text>
      <FlatList
        data={state.adminUsers}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <EmptyState icon="people-outline" title="No users found" />
        }
        renderItem={({ item }) => {
          const isSelf = item.id === actingAdmin.id;
          const busy = busyUserId === item.id;

          if (item.isSuperAdmin) {
            return (
              <View style={styles.userCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{item.fullName} 👑</Text>
                  <Text style={styles.userSub}>
                    {item.department} | {item.email}
                  </Text>
                  <Text style={styles.userSub}>
                    Role: <Text style={styles.roleText}>Super Admin</Text>{" "}
                    (protected)
                  </Text>
                </View>
              </View>
            );
          }

          const canManage = actingAdmin.isSuperAdmin || item.role !== "Admin";

          return (
            <View style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.fullName}</Text>
                <Text style={styles.userSub}>
                  {item.department} | {item.email}
                </Text>
                <Text style={styles.userSub}>
                  Role: <Text style={styles.roleText}>{item.role}</Text>
                  {"  ·  "}
                  Status:{" "}
                  <Text
                    style={
                      item.status === "banned"
                        ? styles.statusBanned
                        : styles.statusActive
                    }
                  >
                    {item.status}
                  </Text>
                </Text>
              </View>
              {canManage && (
                <View style={styles.actionsCol}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      (isSelf || busy) && styles.disabledButton,
                    ]}
                    onPress={() => handleChangeRole(item)}
                    disabled={isSelf || busy}
                    accessibilityRole="button"
                    accessibilityLabel={`Change role for ${item.fullName}`}
                  >
                    <Text style={styles.roleButtonText}>
                      {busy ? "..." : "Change Role"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.status === "banned" && styles.unbanButton,
                      (isSelf || busy) && styles.disabledButton,
                    ]}
                    onPress={() => handleToggleStatus(item)}
                    disabled={isSelf || busy}
                    accessibilityRole="button"
                    accessibilityLabel={
                      item.status === "banned"
                        ? `Unban ${item.fullName}`
                        : `Ban ${item.fullName}`
                    }
                  >
                    <Text style={styles.statusButtonText}>
                      {item.status === "banned" ? "Unban" : "Ban"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fdfdfd",
  },
  userName: { fontSize: 16, fontWeight: "600" },
  userSub: { fontSize: 12, color: "#666", marginTop: 4 },
  roleText: { color: "#003366", fontWeight: "bold" },
  statusActive: { color: "#2e7d32", fontWeight: "bold" },
  statusBanned: { color: "#c62828", fontWeight: "bold" },
  actionsCol: { gap: 8, marginLeft: 10 },
  roleButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  roleButtonText: { fontSize: 12, fontWeight: "600", color: "#333" },
  statusButton: {
    backgroundColor: "#c62828",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  unbanButton: { backgroundColor: "#2e7d32" },
  statusButtonText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  disabledButton: { opacity: 0.4 },
});
