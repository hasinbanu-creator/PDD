import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from 'react-native-linear-gradient';

import { Button } from "../../components/Button";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../../context/AuthContext";
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const { signIn, error: authError } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase());
      navigation.navigate("VerifyLogin", { email: email.trim().toLowerCase() });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HERO SECTION ── */}
        <View style={styles.hero}>
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.decorCircle3} />

          {/* Logo — pushed a bit lower */}
          <View style={styles.logoWrap}>
            <View style={styles.logoBox}>
              <Image
                source={require("../../../assets/icon.png")}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Hero tagline — bottom of red section */}
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>India's #1 Civic{"\n"}Issue Reporting App</Text>
            <Text style={styles.heroSub}>Report. Track. Resolve.</Text>
          </View>
        </View>

        {/* ── FORM SECTION ── */}
        <View style={styles.formSection}>

          {/* TOP: divider + fields + CTA + social */}
          <View style={styles.formTop}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>Log in or sign up</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <View style={[
                styles.inputWrap, 
                errors.email && styles.inputError,
                isFocused && styles.inputFocused
              ]}>
                <Icon name="email-outline" size={20} color={isFocused ? PRIMARY : COLORS.textGray} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#bbb"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors({});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {authError ? (
              <Text style={styles.authError}>{authError}</Text>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={handleLogin}
              disabled={loading}
              style={[styles.continueBtnContainer, loading && styles.continueBtnDisabled]}
            >
              <LinearGradient
                colors={["#2563EB", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <View style={styles.continueBtnContent}>
                    <Text style={styles.continueBtnText}>Continue</Text>
                    <Icon name="arrow-right" size={18} color="#fff" style={styles.continueBtnIcon} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTTOM: sign up + ToS pinned to screen bottom */}
          <View style={styles.formBottom}>
            {/* <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View> */}

            <Text style={styles.tos}>
              By continuing, you agree to our{"\n"}
              <Text style={styles.tosLink}>Terms of Service</Text>
              {"  ·  "}
              <Text style={styles.tosLink}>Privacy Policy</Text>
              {"  ·  "}
              <Text style={styles.tosLink}>Content Policies</Text>
            </Text>
          </View>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const HERO_HEIGHT = 340;
const PRIMARY = "#2563EB";
const ERROR = "#DC2626";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* ── HERO ── */
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: PRIMARY,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  decorCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 40,
    borderColor: "rgba(255,255,255,0.12)",
    top: -50,
    right: -40,
  },
  decorCircle2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 28,
    borderColor: "rgba(255,255,255,0.08)",
    bottom: 10,
    left: -40,
  },
  decorCircle3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: 100,
    left: SCREEN_WIDTH * 0.55,
  },

  /* Logo pushed lower than before */
  logoWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 60,
    alignSelf: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.md,
  },
  logoImg: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },

  heroTextWrap: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.3,
  },

  /* ── FORM ── */
  formSection: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    justifyContent: "space-between",  // pushes formBottom to screen bottom
  },
  formTop: {},
  formBottom: {},

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerLabel: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  fieldGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: "#fafafa",
  },
  inputFocused: {
    borderColor: PRIMARY,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: ERROR,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    paddingVertical: 14,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  errorText: {
    color: ERROR,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },
  authError: {
    color: ERROR,
    fontSize: 12,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  continueBtnContainer: {
    width: "100%",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
    marginBottom: SPACING.lg,
  },
  continueBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
  continueBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  continueBtnIcon: {
    marginLeft: 2,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    color: "#ccc",
    marginBottom: SPACING.md,
    marginTop: SPACING.xxl,
    fontWeight: "500",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: SPACING.sm,
  },
  socialBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  registerText: {
    color: "#999",
    fontSize: 16,
  },
  registerLink: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "800",
  },

  tos: {
    textAlign: "center",
    fontSize: 10,
    color: "#bbb",
    lineHeight: 16,
  },
  tosLink: {
    color: PRIMARY,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;