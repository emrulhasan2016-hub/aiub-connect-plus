// screens/home/PostDetailsScreen.js
import React, { useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../../components/PostCard";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import useApp from "../../hooks/useApp";
import colors from "../../constants/colors";
import routes from "../../constants/routes";

export default function PostDetailsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { state, fetchPost, toggleLike } = useApp();
  const post = state.posts.find((p) => p.id === postId);

  useEffect(() => {
    if (!post) {
      fetchPost(postId).catch(() => {});
    }
  }, [postId]);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Post" onBack={() => navigation.goBack()} />
        <EmptyState icon="document-outline" title="Post not found" subtitle="This post may have been deleted." />
      </SafeAreaView>
    );
  }

  const handleReport = () => {
    Alert.alert("Report Post", "This post has been reported to administrators for review.");
  };

  const handleLike = () => {
    toggleLike(post.id).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Post" onBack={() => navigation.goBack()} rightIcon="flag-outline" onRightPress={handleReport} />
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <PostCard
          post={post}
          author={post.author}
          liked={post.likedByMe}
          commentCount={post.commentCount}
          onLike={handleLike}
          onComment={() => navigation.navigate(routes.COMMENTS, { postId: post.id })}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}