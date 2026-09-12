import React from "react";
import { ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validateEditProfile } from "../../utils/validation";
import colors from "../../constants/colors";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { values, errors, handleChange, validateAll } = useForm(
    {
      fullName: user.fullName,
      department: user.department,
      bio: user.bio || "",
    },
    validateEditProfile,
  );

  const handleSave = () => {
    if (!validateAll()) return;
    updateProfile(values);
    Alert.alert("Profile updated", "Your changes have been saved.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
