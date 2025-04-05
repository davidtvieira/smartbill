import ImagePickerMenu from "@/components/ImagePicker/ImagePickerMenu";
import { useState } from "react";
import { Image, Text, View } from "react-native";

export default function SmartBill() {
  const [image, setImage] = useState<string | null>(null);

  const handleImagePick = (uri: string) => {
    setImage(uri);
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        gap: 20,
        justifyContent: "center",
      }}
    >
      <View style={{ width: "100%" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            color: "#F47A64",
            fontWeight: "bold",
          }}
        >
          Adicionar nova
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 50,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Smart Bill
        </Text>
      </View>

      {image && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
            }}
          />
        </View>
      )}
      <ImagePickerMenu onImagePicked={handleImagePick} />
    </View>
  );
}
