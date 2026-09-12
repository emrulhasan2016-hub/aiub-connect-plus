// screens/home/CommentsScreen.js
// Member 2 --- FR8: supports nested replies, validates comment text (max 200 chars, not empty).
import React, { useState } from "react";
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import CommentCard from "../../components/CommentCard";
import EmptyState from "../../components/EmptyState";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import { validateComment } from "../../utils/validation";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

export default function CommentsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { state, dispatch } = useApp();
  const { user, users } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const comments = state.comments.filter((c) => c.postId === postId);
  const getAuthor = (id) => users.find((u) => u.id === id);

  const handleSend = () => {
    const err = validateComment(text);
    if (err) {
      setError(err);
      return;
    }
    if (replyTo) {
      dispatch({
        type: "ADD_REPLY",
        payload: { commentId: replyTo, reply: { id: "r" + Date.now(), userId: user.id, text, createdAt: new Date().toISOString() } },
      });
    } else {
      dispatch({
        type: "ADD_COMMENT",
        payload: { id: "c" + Date.now(), postId, userId: user.id, text, createdAt: new Date().toISOString(), replies: [] },
      });
    }
    setText("");
    setError(null);
    setReplyTo(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Comments" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14 }}
          ListEmptyComponent={<EmptyState icon="chatbubbles-outline" title="No comments yet" subtitle="Start the conversation." />}
          renderItem={({ item }) => (
            <View>
              <CommentCard comment={item} author={getAuthor(item.userId)} />
              {item.replies.map((r) => (
                <CommentCard key={r.id} comment={r} author={getAuthor(r.userId)} isReply />
              ))}
              <TouchableOpacity onPress={() => setReplyTo(item.id)} style={{ marginLeft: 44, marginBottom: 10 }}>
                <Text style={styles.replyLink}>Reply</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {replyTo ? (
          <View style={styles.replyingBar}>
            <Text style={styles.replyingText}>Replying to a comment</Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={text}
            onChangeText={(v) => { setText(v); setError(null); }}
            maxLength={200}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Ionicons name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  replyLink: { color: colors.navy, fontSize: fonts.size.xs, fontWeight: fonts.weight.semibold },
  replyingBar: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.gray200, paddingHorizontal: 16, paddingVertical: 6 },
  replyingText: { fontSize: fonts.size.xs, color: colors.muted },
  inputBar: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray200 },
  input: { flex: 1, backgroundColor: colors.panel, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: fonts.size.sm },
  sendBtn: { backgroundColor: colors.navy, width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  errorText: { color: colors.danger, fontSize: fonts.size.xs, paddingHorizontal: 16, paddingBottom: 6, backgroundColor: colors.white },
});
