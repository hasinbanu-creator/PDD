import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from 'react-native-linear-gradient';
import { COLORS, GRADIENTS, SHADOWS, SPACING } from "../constants/theme";

export const Button = ({
  title,
  text,
  children,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  size = "md",
  fullWidth = true,
  style,
  textStyle,
}) => {
  const isSecondary = variant === "secondary" || variant === "outline";

  const buttonText = title || text || children;

  const content = loading ? (
    <ActivityIndicator color={isSecondary ? "#2563EB" : "#FFFFFF"} size="small" />
  ) : (
    <Text
      style={[
        {
          color: isSecondary ? "#2563EB" : "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
        },
        textStyle,
      ]}
    >
      {buttonText}
    </Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          width: fullWidth ? "100%" : "auto",
          height: 52,
          borderRadius: 14,
          paddingHorizontal: 20,
          backgroundColor: disabled ? "#CBD5E1" : isSecondary ? "#FFFFFF" : "#2563EB",
          borderWidth: isSecondary ? 1.5 : 0,
          borderColor: isSecondary ? "#2563EB" : "transparent",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          ...(variant === "primary" && !disabled ? {
            shadowColor: "#2563EB",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          } : {}),
        },
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

export default Button;
