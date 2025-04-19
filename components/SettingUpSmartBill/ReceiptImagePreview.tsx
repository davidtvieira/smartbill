import React from "react";
import { Image, View } from "react-native";

interface Props {
  imageUri: string;
}

export default function ReceiptImagePreview({ imageUri }: Props) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
      />
    </View>
  );
}
