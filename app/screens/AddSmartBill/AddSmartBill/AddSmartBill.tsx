import Button from "@/components/Buttons/Button/Button";
import ImagePickerMenu from "@/components/Buttons/ImagePicker/ImagePickerMenu";
import TopText from "@/components/TopText/TopText";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
export default function ImagePicker() {
  const navigation = useNavigation() as any;

  const handleImagePick = (uri: string) => {
    navigation.navigate("SettingUpSmartBill", { imageUri: uri });
  };

  return (
    <View
      style={{
        gap: 20,
        justifyContent: "center",
      }}
    >
      <TopText first="adicionar nova" second="Smart Bill" />
      <ImagePickerMenu onImagePicked={handleImagePick} />
      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        variant="secondary"
      />
    </View>
  );
}
