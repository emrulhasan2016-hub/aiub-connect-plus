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
import NoticeCard from "../components/NoticeCard";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

const CATEGORIES = [
  "All",
  "Academic",
  "Exam",
  "Assignment",
  "Seminar",
  "Workshop",
];
export default function NoticeBoardScreen({ navigation }) {
  const { state } = useApp();
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const filteredNotices = state.notices.filter((n) => {
    const matchesCat = selectedCat === "All" || n.category === selectedCat;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notices..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              selectedCat === cat && styles.activeCatChip,
            ]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text
              style={[
                styles.catText,
                selectedCat === cat && styles.activeCatText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoticeCard
            notice={item}
            onPress={() =>
              navigation.navigate(routes.NOTICE_DETAILS, { noticeId: item.id })
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
  catScroll: { maxHeight: 40, marginBottom: spacing.md },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: sizes.radiusSm,
    marginRight: spacing.sm,
    height: 32,
    justifyContent: "center",
  },
  activeCatChip: { backgroundColor: colors.navy },
  catText: {
    color: colors.muted,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
  },
  activeCatText: { color: colors.white, fontWeight: fonts.weight.bold },
  list: { paddingBottom: spacing.xl },
});
