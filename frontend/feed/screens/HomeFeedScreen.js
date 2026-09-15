// screens/home/HomeFeedScreen.js
import React, { useEffect, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import useApp from "../../hooks/useApp";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function HomeFeedScreen({ navigation }) {
  const { state, fetchPosts, toggleLike } = useApp();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = (postId) => {
    toggleLike(postId).catch(() => {});
  };

  if (state.postsStatus === "loading" && state.posts.length === 0) {
    return <Loading text="Loading feed..." />;
  }

  if (state.postsStatus === "error" && state.posts.length === 0) {
    return (
      <SafeAreaView style={styles.wrap} edges={["top"]}>
        <EmptyState icon="cloud-offline-outline" title="Couldn't load feed" subtitle={state.postsError || "Please try again."} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AIUB Connect<Text style={{ color: colors.gold }}>+</Text></Text>
      </View>
      <FlatList
        data={state.posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 14 }}
        refreshing={state.postsStatus === "loading"}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyState icon="albums-outline" title="No posts yet" subtitle="Be the first to share something with the community." />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            author={item.author}
            liked={item.likedByMe}
            commentCount={item.commentCount}
            onLike={() => handleLike(item.id)}
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