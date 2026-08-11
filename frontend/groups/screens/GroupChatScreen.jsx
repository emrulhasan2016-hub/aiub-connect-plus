import React, { useState } from "react";
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
  const { state, dispatch } = useApp();
  const { user, users } = useAuth();
  const [inputText, setInputText] = useState("");
  const group = state.groups.find((g) => g.id === groupId);
  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: "m" + Date.now(),
      userId: user.id,
      text: inputText.trim(),
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: "SEND_GROUP_MESSAGE",
      payload: { groupId: group.id, message: newMessage },
    });

    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={group.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMe = item.userId === user.id;
          const sender = users.find((u) => u.id === item.userId);

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
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
