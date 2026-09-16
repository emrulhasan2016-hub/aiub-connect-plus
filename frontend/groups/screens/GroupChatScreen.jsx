import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import sizes from "../../constants/sizes";
import fonts from "../../constants/fonts";
import { timeAgo } from "../../utils/time";

export default function GroupChatScreen({ route }) {
  const { groupId } = route.params;
  const { state, fetchGroupMessages, sendGroupMessage } = useApp();
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const group = state.groups.find((g) => g.id === groupId);
  const messages = state.messagesByGroup[groupId] || [];
  const status = state.messagesStatus[groupId] || "idle";

  // Messages now come from the backend, so they survive an app reload.
  useEffect(() => {
    fetchGroupMessages(groupId).catch(() =>
      setError("Could not load messages."),
    );
  }, [groupId, fetchGroupMessages]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    try {
      await sendGroupMessage(groupId, text);
      setInputText("");
    } catch (err) {
      const status = err?.response?.status;
      setError(
        status === 403
          ? "Join this group before sending a message."
          : "Message failed to send. Check your connection.",
      );
    } finally {
      setSending(false);
    }
  }, [inputText, sending, groupId, sendGroupMessage]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMe = item.userId === user.id;
          const sender = item.sender;

          return (
            <View
              style={[styles.msgWrapper, isMe ? styles.msgMe : styles.msgOther]}
            >
              {!isMe && (
                <Text style={styles.senderName}>
                  {sender ? sender.fullName : "User"}
                </Text>
              )}
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.bubbleMe : styles.bubbleOther,
                ]}
              >
                <Text style={[styles.msgText, isMe && styles.textMe]}>
                  {item.text}
                </Text>
              </View>
              <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          status === "loading" ? (
            <Text style={styles.stateText}>Loading messages...</Text>
          ) : status === "error" ? (
            <Text style={styles.stateText}>Could not load messages.</Text>
          ) : (
            <Text style={styles.stateText}>
              No messages yet. Say hello to the group!
            </Text>
          )
        }
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          editable={!sending}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={sending}
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  stateText: {
    textAlign: "center",
    color: colors.muted,
    marginTop: spacing.xl,
    fontSize: fonts.size.sm,
  },
  errorText: {
    color: colors.danger || "#c0392b",
    fontSize: fonts.size.xs,
    textAlign: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  sendBtnDisabled: { opacity: 0.5 },
  chatList: { padding: spacing.md },
  msgWrapper: { marginBottom: spacing.md, maxWidth: "80%" },
  msgMe: { alignSelf: "flex-end" },
  msgOther: { alignSelf: "flex-start" },
  senderName: { fontSize: fonts.size.xs, color: colors.muted, marginBottom: 2 },
  bubble: { padding: spacing.md, borderRadius: sizes.radiusMd },
  bubbleMe: { backgroundColor: colors.navy, borderBottomRightRadius: 2 },
  bubbleOther: { backgroundColor: colors.white, borderBottomLeftRadius: 2 },
  msgText: { fontSize: fonts.size.base, color: colors.text },
  textMe: { color: colors.white },
  time: {
    fontSize: fonts.size.xs,
    color: colors.muted,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.white,
    alignItems: "center",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray100,
    height: 42,
    borderRadius: sizes.radiusSm,
    paddingHorizontal: spacing.md,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.navy,
    justifyContent: "center",
    alignItems: "center",
  },
});
