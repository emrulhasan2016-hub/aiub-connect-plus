// screens/home/CreatePostScreen.js
// Member 2 --- FR6: Create Post validates content (max 500 chars), category & visibility
// dropdowns, live character counter, mock image picker, preview.
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import useForm from "../../hooks/useForm";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import { validatePostContent } from "../../utils/validation";
import { postImages } from "../../constants/dummyImages";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import sizes from "../../constants/sizes";

const CATEGORIES = [
  "General Discussion", "Academic Discussion", "Notice", "Job Circular",
  "Internship", "Scholarship", "Event", "Study Material", "Lost & Found", "Achievement",
];
const VISIBILITY = ["Public", "Group Only"];

export default function CreatePostScreen({ navigation }) {
  const { dispatch } = useApp();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState("Public");
  const { values, errors, handleChange, validateAll, reset } = useForm(
    { content: "", category: "" },
    validatePostContent
  );

  const pickMockImage = () => {
    const random = postImages[Math.floor(Math.random() * postImages.length)];
    setImage(random);
  };

  const handlePost = () => {
    if (!validateAll()) return;
    const newPost = {
      id: "p" + Date.now(),
      userId: user.id,
      category: values.category,
      content: values.content,
      image,
      likedBy: [],
      visibility,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_POST", payload: newPost });
    reset();
    setImage(null);
    Alert.alert("Posted!", "Your post is now live on the home feed.", [
      { text: "OK", onPress: () => navigation.getParent()?.navigate("HomeTab") },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Create Post" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <InputField
          placeholder="What's on your mind?"
          value={values.content}
          onChangeText={(v) => handleChange("content", v)}
          error={errors.content}
          multiline
          maxLength={500}
        />
        <Text style={styles.counter}>{values.content.length}/500</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} style={[styles.chip, values.category === c && styles.chipActive]} onPress={() => handleChange("category", c)}>
              <Text style={[styles.chipText, values.category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}

        <Text style={styles.label}>Visibility</Text>
        <View style={styles.chipsWrap}>
          {VISIBILITY.map((v) => (
            <TouchableOpacity key={v} style={[styles.chip, visibility === v && styles.chipActive]} onPress={() => setVisibility(v)}>
              <Text style={[styles.chipText, visibility === v && styles.chipTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickMockImage}>
          <Text style={styles.imagePickerText}>{image ? "Change Image" : "+ Add Image (mock)"}</Text>
        </TouchableOpacity>
        {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

        <PrimaryButton title="Publish Post" onPress={handlePost} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  counter: { alignSelf: "flex-end", color: colors.muted, fontSize: fonts.size.xs, marginTop: -8, marginBottom: 12 },
  label: { fontSize: fonts.size.sm, fontWeight: fonts.weight.semibold, color: colors.text, marginBottom: 8, marginTop: 6 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  chip: { borderWidth: 1, borderColor: colors.gray300, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: fonts.size.xs, color: colors.text },
  chipTextActive: { color: colors.white, fontWeight: fonts.weight.bold },
  errorText: { color: colors.danger, fontSize: fonts.size.xs, marginBottom: 10 },
  imagePicker: { borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.gray300, borderRadius: sizes.radiusSm, padding: 14, alignItems: "center", marginTop: 14 },
  imagePickerText: { color: colors.navy, fontWeight: fonts.weight.semibold },
  preview: { width: "100%", height: 180, borderRadius: sizes.radiusSm, marginTop: 10 },
});
