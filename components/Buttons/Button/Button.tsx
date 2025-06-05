import React from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styleButton";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "alternative" | "onlyText" | "danger";
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    alternative: styles.alternative,
    onlyText: styles.onlyText,
    danger: styles.danger,
  };

  const buttonStyle = [
    styles.button,
    variantStyles[variant] || styles.primary,
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
