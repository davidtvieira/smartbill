import React from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styleButton";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "alternative" | "disabled" | "clear";
}

export default function Button({
  title,
  onPress,
  variant = "primary",
}: ButtonProps) {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    alternative: styles.alternative,
    disabled: styles.disabled,
    clear: styles.clear,
  };

  const buttonStyle = variantStyles[variant] || styles.primary;
  const isDisabled = variant === "disabled";

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={isDisabled ? 1 : 0.7}
      disabled={isDisabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
