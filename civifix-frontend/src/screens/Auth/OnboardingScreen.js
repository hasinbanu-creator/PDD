import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from 'react-native-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../constants/theme";
import Screen from "../../components/Screen";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to CiviFix",
    description: "Your platform to report and track civic issues directly to your local government.",
  },
  {
    id: "2",
    title: "Report Issues Easily",
    description: "Snap a photo, add location details, and submit your complaint in seconds.",
  },
  {
    id: "3",
    title: "Track Progress",
    description: "Stay updated on the status of your complaints and see real-time progress.",
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  return (
    <Screen style={styles.container}>
      {/* Premium Top Bar with Skip Link */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity 
            onPress={handleSkip} 
            activeOpacity={0.7} 
            style={styles.skipContainer}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../../assets/icon.png")} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </View>
        <Text style={styles.title}>{slides[currentIndex].title}</Text>
        <Text style={styles.description}>{slides[currentIndex].description}</Text>
      </View>
      
      <View style={styles.footer}>
        {/* Modern Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        
        {/* Full-width premium action button */}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={handleNext}
            style={styles.nextButtonContainer}
          >
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: SPACING.xl,
    justifyContent: "space-between",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  skipContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  skipText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
  skipPlaceholder: {
    height: 30,
    width: 50,
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  imageContainer: {
    width: width * 0.65,
    height: width * 0.65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxl,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.md,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    paddingBottom: SPACING.xl + 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.xl + 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#2563EB",
    width: 16,
  },
  actions: {
    width: "100%",
  },
  nextButtonContainer: {
    width: "100%",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButton: {
    borderRadius: 28,
    height: 56,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default OnboardingScreen;
