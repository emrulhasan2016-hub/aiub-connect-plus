// styles/globalStyles.js
// Shared style building blocks reused across screens for a consistent look (NFR1).
import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import spacing from "../constants/spacing";
import sizes from "../constants/sizes";
import fonts from "../constants/fonts";

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenPad: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusMd,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: "#0E2647",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: fonts.size.lg, fontWeight: fonts.weight.bold, color: colors.navyDark },
  subtitle: { fontSize: fonts.size.sm, color: colors.muted, marginTop: 2 },
  bodyText: { fontSize: fonts.size.base, color: colors.text, lineHeight: 20 },
  sectionHeader: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.bold,
    color: colors.navyDark,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  divider: { height: 1, backgroundColor: colors.gray300, marginVertical: spacing.sm },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
