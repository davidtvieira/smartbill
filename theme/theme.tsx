const colors = {
  primary: "#F47A64",
  secondary: "#273C47",
  third: "#2C4450",
  text: "#FFFFFF",
  textAltern: "black",
};

export const theme = {
  colors,

  fonts: {
    primary: "Roboto_Condensed-Regular",
    bold: "Roboto_Condensed-Bold",
  },

  text: {
    large: 18,
    regular: 16,
    small: 14,
    color: colors.text,
  },

  button: {
    color: {
      primary: colors.primary,
      secondary: colors.secondary,
      third: colors.third,
      onlytext: "transparent",
      disabled: 0.5,
      danger: "#FF586D",
    },
    text: {
      large: 18,
      medium: 16,
      small: 14,
      color: colors.text,
    },
    border: {
      radius: 8,
    },
  },
};
