// screens/home/HomeFeedScreen.js
// Member 2 --- FR5: Home Feed shows posts via FlatList with pull-to-refresh, loading, empty states.
import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function HomeFeedScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user, users } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAuthor = (userId) => users.find((u) => u.id === userId);
  const getCommentCount = (postId) => state.comments.filter((c) => c.postId === postId).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const toggleLike = (postId) => {
    dispatch({ type: "TOGGLE_LIKE", payload: { postId, userId: user.id } });
  };

  if (loading) return <Loading text="Loading feed..." />;

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AIUB Connect<Text style={{ color: colors.gold }}>+</Text></Text>
      </View>
      <FlatList
        data={state.posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyState icon="albums-outline" title="No posts yet" subtitle="Be the first to share something with the community." />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            author={getAuthor(item.userId)}
            liked={item.likedBy.includes(user.id)}
            commentCount={getCommentCount(item.id)}
            onLike={() => toggleLike(item.id)}
            onPress={() => navigation.navigate(routes.POST_DETAILS, { postId: item.id })}
            onComment={() => navigation.navigate(routes.COMMENTS, { postId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  headerTitle: { fontSize: fonts.size.lg, fontWeight: fonts.weight.extrabold, color: colors.navyDark },
});
