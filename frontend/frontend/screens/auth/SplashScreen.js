// screens/auth/SplashScreen.js
// Member 1 — FR1: Splash screen shows branding and a Get Started button → Login.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import routes from "../../constants/routes";

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.center}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>AC+</Text>
        </View>
        <Text style={styles.title}>
          AIUB Connect<Text style={{ color: colors.gold }}>+</Text>
        </Text>
        <Text style={styles.subtitle}>
          A private academic community & social network exclusively for AIUB students, faculty, and alumni.
        </Text>
      </View>

      <PrimaryButton
        title="Get Started"
        onPress={() => navigation.replace(routes.LOGIN)}
        style={{ marginHorizontal: 24, marginBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.navyDark, justifyContent: "space-between" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 24, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  logoText: { fontSize: fonts.size.xl, fontWeight: fonts.weight.extrabold, color: colors.navyDark },
  title: { fontSize: fonts.size.display, fontWeight: fonts.weight.extrabold, color: colors.white },
  subtitle: { color: "#C9D4E8", textAlign: "center", marginTop: 14, fontSize: fonts.size.sm, lineHeight: 20 },
});
