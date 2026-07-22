import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function AppSettingsScreen() {
  const [appName, setAppName] = useState("AIUB Connect+");
  const [maxGroupLimit, setMaxGroupLimit] = useState("10");
  const [errors, setErrors] = useState({});

  // Client-side Form Validation

  const handleSaveSettings = () => {
    let currentErrors = {};

    if (!appName.trim()) {
      currentErrors.appName = "App Name is required!";
    }

    if (
      !maxGroupLimit ||
      isNaN(maxGroupLimit) ||
      parseInt(maxGroupLimit) <= 0
    ) {
      currentErrors.maxGroupLimit = "Please enter a valid positive number!";
    }

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      Alert.alert("Success", "Admin settings updated successfully!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin App Settings</Text>

      {/* Input 1: App Name */}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Application Title</Text>
        <TextInput
          style={[styles.input, errors.appName && styles.errorInput]}
          value={appName}
          onChangeText={setAppName}
          placeholder="Enter App Name"
        />
        {errors.appName && (
          <Text style={styles.errorText}>{errors.appName}</Text>
        )}
      </View>

      {/* Input 2: Max Group Limit */}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Max Groups Per User</Text>
        <TextInput
          style={[styles.input, errors.maxGroupLimit && styles.errorInput]}
          value={maxGroupLimit}
          onChangeText={setMaxGroupLimit}
          keyboardType="numeric"
          placeholder="Enter Group Limit"
        />
        {errors.maxGroupLimit && (
          <Text style={styles.errorText}>{errors.maxGroupLimit}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#333" },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fdfdfd",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  saveButton: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
