import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApp from "../../hooks/useApp";
import JobCard from "../components/JobCard";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

const TYPES = ["All", "Job", "Internship", "Freelancing", "Scholarship"];
export default function JobPortalScreen({ navigation }) {
  const { state } = useApp();
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const filteredJobs = state.jobs.filter((j) => {
    const matchesType = selectedType === "All" || j.type === selectedType;
    const matchesSearch =
      j.position.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, internships..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeScroll}
      >
        {TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeChip,
              selectedType === type && styles.activeTypeChip,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.activeTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() =>
              navigation.navigate(routes.JOB_DETAILS, { jobId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: sizes.radiusSm,
    paddingHorizontal: spacing.md,
    height: 42,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm },
  typeScroll: { maxHeight: 40, marginBottom: spacing.md },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: sizes.radiusSm,
    marginRight: spacing.sm,
    height: 32,
    justifyContent: "center",
  },
  activeTypeChip: { backgroundColor: colors.goldDark },
  typeText: {
    color: colors.muted,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
  },
  activeTypeText: { color: colors.white, fontWeight: fonts.weight.bold },
  list: { paddingBottom: spacing.xl },
});
