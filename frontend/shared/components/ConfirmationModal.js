// components/ConfirmationModal.js
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import sizes from "../constants/sizes";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function ConfirmationModal({ visible, title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <SecondaryButton title="Cancel" onPress={onCancel} style={{ flex: 1, marginRight: 8 }} />
            <PrimaryButton title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(14,38,71,0.45)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { backgroundColor: colors.white, borderRadius: sizes.radiusLg, padding: 22, width: "100%" },
  title: { fontSize: fonts.size.md, fontWeight: fonts.weight.bold, color: colors.navyDark },
  message: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 8, lineHeight: 20 },
  actions: { flexDirection: "row", marginTop: 20 },
});
