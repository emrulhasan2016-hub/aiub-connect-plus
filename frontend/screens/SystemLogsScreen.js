import React from "react";
import { View, Text, StyleSheet, Flatlist } from "react-native";

const logsdata = [
  { id: "1", action: "User Login", user: "Zihadul Islam", time: "10:15 AM" },
  {
    id: "2",
    action: "Created New Group",
    user: "Tasvir Hasan",
    time: "11:30 AM",
  },
  { id: "3", action: "Role Changed", user: "Emrul Hassan", time: "01:05 PM" },
  { id: "4", action: "Post Deleted", user: "Moderator", time: "02:40 PM" },
];
export default function SystemLogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Audit Logs</Text>
      <FlatList
        data={logsdata}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View>
              <Text style={styles.actionText}>{item.action}</Text>
              <Text style={styles.userText}>By: {item.user}</Text>
            </View>
            <Text style={styles.timetext}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  logCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  actionText: { fontSize: 15, fontWeight: "600", color: "#003366" },
  userText: { fontSize: 13, color: "#666", marginTop: 3 },
  timeText: { fontSize: 12, color: "#888" },
});
