import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import Button from "../Button/Button";
import styles from "./styleImagePickerMenu";

interface ImagePickerMenuProps {
  onImagePicked: (uri: string) => void;
}

export default function ImagePickerMenu({
  onImagePicked,
}: ImagePickerMenuProps) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      exif: false,
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
    <View style={styles.imagePickerMenu}>
      <Button title="Tirar uma foto" onPress={takePhoto} />
      <Button title="Escolhe uma imagem da galeria" onPress={pickImage} />
    </View>
  );
}
