import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from "../../constants/theme";
import Screen from "../../components/Screen";
import { AuthContext } from "../../context/AuthContext";

const ContactMethod = ({ icon, title, subtitle, onPress, primaryColor }) => (
  <TouchableOpacity style={styles.methodCard} activeOpacity={0.8} onPress={onPress}>
    <View style={[styles.methodIcon, { backgroundColor: `${primaryColor}15` }]}>
      <Icon name={icon} size={24} color={primaryColor} />
    </View>
    <View style={styles.methodInfo}>
      <Text style={styles.methodTitle}>{title}</Text>
      <Text style={styles.methodSubtitle}>{subtitle}</Text>
    </View>
    <Icon name="chevron-right" size={24} color={COLORS.textGray} />
  </TouchableOpacity>
);

const ContactSupportScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const isInspector = user?.role === "INSPECTOR";
  const primaryColor = isInspector ? "#0F8A83" : COLORS.primary;

  const handleEmailPress = () => {
    Linking.openURL("mailto:civifix.support@gmail.com");
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        <Text style={styles.description}>
          For any questions, technical issues, or assistance regarding CiviFix, please contact our support team. We will respond as soon as possible.
        </Text>

        <ContactMethod 
          icon="email-outline"
          title="Email Support"
          subtitle="civifix.support@gmail.com"
          primaryColor={primaryColor}
          onPress={handleEmailPress}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", padding: SPACING.xl,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  backButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center",
    marginRight: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: "700", color: COLORS.textDark },
  scrollContent: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  sectionTitle: {
    fontSize: FONT_SIZES.base, fontWeight: "700", color: COLORS.textDark,
    marginBottom: SPACING.sm, marginTop: SPACING.md, marginLeft: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm, color: COLORS.textLight, lineHeight: 20,
    marginBottom: SPACING.lg, marginLeft: SPACING.xs, marginRight: SPACING.xs,
  },
  methodCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card,
    padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  methodIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: FONT_SIZES.base, fontWeight: "600", color: COLORS.textDark, marginBottom: 2 },
  methodSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
});

export default ContactSupportScreen;
