import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function AdminDashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Admin Panel Dashboard</Text>

      {/* Quick Stats Cards */}

      <View style={styles.statsContainer}>
        <View style={[styles.card, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.cardValue}>1,250</Text>
          <Text style={styles.cardLabel}>Total Users</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#2196F3" }]}>
          <Text style={styles.cardValue}>48</Text>
          <Text style={styles.cardLabel}>Active Groups</Text>
        </View>
      </View>

      {/* Admin Actions */}

      <View style={styles.actionContainer}>
        <Text style={styles.sectionTitle}>Management Controls</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation?.navigate("UserManagement")}
        >
          <Text style={styles.buttonText}>Manage Users & Roles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation?.navigate("SystemLogs")}
        >
          <Text style={styles.buttonText}>View System Audit Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation?.navigate("AppSettings")}
        >
          <Text style={styles.buttonText}>App System Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cardValue: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  cardLabel: { fontSize: 12, color: "#fff", marginTop: 5 },
  actionContainer: { marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#444",
  },
  button: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: { backgroundColor: "#444" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
