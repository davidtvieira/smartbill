import { ActivityIndicator, Image, View } from "react-native";
import styles from "./styleImagePreview";

type ReceiptImagePreviewProps = {
  imageUri: string;
  loading?: boolean;
};

export default function ReceiptImagePreview({
  imageUri,
  loading = false,
}: ReceiptImagePreviewProps) {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
    </View>
  );
}
