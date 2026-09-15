import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const initialUsers = [
  { id: "1", name: "Zihadul islam", role: "Member", dept: "CSE" },
  { id: "2", name: "Sajib Ahmed", role: "Member", dept: "CSE" },
  { id: "3", name: "Tasvir uddin", role: "Moderator", dept: "CSE" },
  { id: "4", name: "Emrul Hassan", role: "Admin", dept: "CSE" },
];

export default function UserManagementScreen() {
  const [users, setUsers] = useState(initialUsers);
  const toggleRole = (id) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newRole =
            u.role === "Member"
              ? "Moderator"
              : u.role === "Moderator"
                ? "Admin"
                : "Member";
          return { ...u, role: nextRole };
        }
        return u;
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Role Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userSub}>
                {item.dept}|Current Role:
                <Text style={styles.roleText}>{item.role}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => toggleRole(item.id)}
            >
              <Text style={styles.roleButtonText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        )}
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
  roleButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  roleButtonText: { fontSize: 12, fontWeight: "600", color: "#333" },
});
