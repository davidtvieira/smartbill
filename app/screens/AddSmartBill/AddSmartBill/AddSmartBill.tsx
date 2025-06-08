import ImagePickerMenu from "@/components/Buttons/ImagePicker/ImagePickerMenu";
import TopText from "@/components/TopText/TopText";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import styles from "./styleAddSmartBill";

export default function ImagePicker() {
  const navigation = useNavigation() as any;

  const handleImagePick = (uri: string) => {
    navigation.navigate("SettingUpSmartBill", { imageUri: uri });
  };

  return (
    <View style={styles.container}>
      <TopText first="adicionar nova" third="Smart Bill" />
      <ImagePickerMenu onImagePicked={handleImagePick} />
      <View style={{ paddingTop: 20 }}></View>
    </View>
  );
}
