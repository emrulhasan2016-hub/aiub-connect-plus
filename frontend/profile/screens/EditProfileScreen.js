import React, { useState } from "react";
import {
  ScrollView,
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validateEditProfile } from "../../utils/validation";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import spacing from "../../constants/spacing";
import { avatars, covers } from "../../constants/dummyImages";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [avatar, setAvatar] = useState(user.avatar || avatars[0]);
  const [cover, setCover] = useState(user.cover || covers[0]);
  const { values, errors, handleChange, validateAll } = useForm(
    {
      fullName: user.fullName,
      department: user.department,
      bio: user.bio || "",
    },
    validateEditProfile,
  );

  const handleSave = async () => {
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      await updateProfile({ ...values, avatar, cover });
      Alert.alert("Profile updated", "Your changes have been saved.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Could not save changes", err.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionLabel}>Cover Photo</Text>
        <Image source={{ uri: cover }} style={styles.coverPreview} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {covers.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCover(c)}>
              <Image
                source={{ uri: c }}
                style={[styles.coverThumb, cover === c && styles.thumbSelected]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Profile Picture</Text>
        <View style={styles.avatarPreviewRow}>
          <Image source={{ uri: avatar }} style={styles.avatarPreview} />
          <Text style={styles.hint}>
            Pick one of the preset images below. Photo upload from your device
            is not supported yet.
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {avatars.map((a) => (
            <TouchableOpacity key={a} onPress={() => setAvatar(a)}>
              <Image
                source={{ uri: a }}
                style={[
                  styles.avatarThumb,
                  avatar === a && styles.thumbSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <InputField
          label="Full Name"
          value={values.fullName}
          onChangeText={(v) => handleChange("fullName", v)}
          error={errors.fullName}
        />
        <InputField
          label="Department"
          value={values.department}
          onChangeText={(v) => handleChange("department", v)}
          error={errors.department}
        />
        <InputField
          label="Bio"
          value={values.bio}
          onChangeText={(v) => handleChange("bio", v)}
          multiline
          maxLength={150}
        />
        <PrimaryButton
          title="Save Changes"
          onPress={handleSave}
          loading={submitting}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: fonts.size.sm,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  coverPreview: {
    width: "100%",
    height: 110,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  thumbRow: { gap: 10, paddingVertical: spacing.sm },
  coverThumb: {
    width: 90,
    height: 46,
    borderRadius: 6,
    backgroundColor: colors.gray100,
  },
  avatarPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarPreview: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.gray100,
  },
  hint: {
    flex: 1,
    fontSize: fonts.size.xs,
    color: colors.muted,
    lineHeight: 16,
  },
  avatarThumb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.gray100,
  },
  thumbSelected: { borderWidth: 3, borderColor: colors.navy },
});
