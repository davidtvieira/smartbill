import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState("back"); // Usamos diretamente as strings 'back' e 'front'
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(facing === "back" ? "front" : "back");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <CameraView style={{ flex: 1 }} facing={facing}></CameraView>
      <Button onPress={toggleCameraFacing} title="virar camera" />
    </View>
  );
}
