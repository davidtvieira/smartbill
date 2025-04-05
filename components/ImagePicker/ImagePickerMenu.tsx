import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import Button from "../buttons/Button";

interface ImagePickerMenuProps {
  onImagePicked: (uri: string) => void; // Callback to send the image URI back to the parent
}

export default function ImagePickerMenu({
  onImagePicked,
}: ImagePickerMenuProps) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <Button title="Tirar uma foto" onPress={takePhoto} />
      <Button title="Escolhe uma imagem da galeria" onPress={pickImage} />
    </View>
  );
}
