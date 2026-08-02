// screens/home/PostDetailsScreen.js
// Member 2 --- FR7: shows full post + author info + like/comment/share/report actions.
import React from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import EmptyState from "../../components/EmptyState";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import routes from "../../constants/routes";

export default function PostDetailsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { state, dispatch } = useApp();
  const { user, users } = useAuth();
  const post = state.posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Post" onBack={() => navigation.goBack()} />
        <EmptyState icon="document-outline" title="Post not found" subtitle="This post may have been deleted." />
      </SafeAreaView>
    );
  }

  const author = users.find((u) => u.id === post.userId);
  const commentCount = state.comments.filter((c) => c.postId === post.id).length;

  const handleReport = () => {
    Alert.alert("Report Post", "This post has been reported to administrators for review.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Post" onBack={() => navigation.goBack()} rightIcon="flag-outline" onRightPress={handleReport} />
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <PostCard
          post={post}
          author={author}
          liked={post.likedBy.includes(user.id)}
          commentCount={commentCount}
          onLike={() => dispatch({ type: "TOGGLE_LIKE", payload: { postId: post.id, userId: user.id } })}
          onComment={() => navigation.navigate(routes.COMMENTS, { postId: post.id })}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
