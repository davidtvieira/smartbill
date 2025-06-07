import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import styles from "./styleButton";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "alternative" | "onlyText" | "danger";
  disabled?: boolean;
  icon?: ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  icon,
}: ButtonProps) {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    alternative: styles.alternative,
    onlyText: styles.onlyText,
    danger: styles.danger,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {title && <Text style={styles.text}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
}
