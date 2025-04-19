import { processReceiptImage, SmartBillData } from "@/components/API/api_call";
import Button from "@/components/buttons/Button";
import FieldEditModal from "@/components/SettingUpSmartBill/FieldEditModal";
import ReceiptForm from "@/components/SettingUpSmartBill/ReceiptForm";
import ReceiptImagePreview from "@/components/SettingUpSmartBill/ReceiptImagePreview";
import TopText from "@/components/TopText/TopTex";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

interface ReceiptItem {
  titulo: string;
  quantidade: number;
  preco_unitario: number;
}

interface RouteParams {
  imageUri: string;
}

export default function SettingUpSmartBill() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as RouteParams;

  const [loading, setLoading] = useState(false);
  const [editedData, setEditedData] = useState<SmartBillData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(false);

  const handleSaveSmartBill = () => {
    const billData = JSON.stringify(editedData, null, 2);
    console.log("Smart Bill Guardado:\n", billData);
  };

  const handleFieldEdit = (field: keyof SmartBillData) => {
    setEditingField(field);
    setModalVisible(true);
  };

  const handleFieldChange = (field: keyof SmartBillData, value: string) => {
    setEditedData((prevData) =>
      prevData ? { ...prevData, [field]: value } : null
    );
  };

  const handleItemEdit = (
    index: number,
    field: keyof ReceiptItem,
    value: string
  ) => {
    if (!editedData) return;
    const updatedItems = [...editedData.items];
    if (field === "quantidade" || field === "preco_unitario") {
      const numericValue =
        field === "quantidade" ? parseInt(value) : parseFloat(value);
      updatedItems[index][field] = isNaN(numericValue)
        ? (0 as never)
        : (numericValue as never);
    } else {
      updatedItems[index][field] = value as never;
    }
    setEditedData({ ...editedData, items: updatedItems });
  };

  const handleItemEditStart = (index: number) => {
    setEditingField(`item-${index}`);
    setIsItemEditing(true);
    setModalVisible(true);
  };

  const handleItemEditFinish = () => {
    setIsItemEditing(false);
  };

  const handleImageProcessing = async () => {
    setLoading(true);
    try {
      const parsedData = await processReceiptImage(imageUri);
      setEditedData(parsedData);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      Alert.alert(
        "Erro",
        error.message || "Ocorreu um erro ao processar a imagem."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: 20, padding: 20, justifyContent: "center", flex: 1 }}>
      <TopText first="configurar" second="Smart Bill" />

      {!editedData && <ReceiptImagePreview imageUri={imageUri} />}

      {loading && <ActivityIndicator size="large" color="#000" />}

      {editedData && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <ReceiptForm
            data={editedData}
            onFieldEdit={handleFieldEdit}
            onItemEditStart={handleItemEditStart}
          />
        </ScrollView>
      )}

      <FieldEditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingField={editingField}
        isItemEditing={isItemEditing}
        editedData={editedData}
        onFieldChange={handleFieldChange}
        onItemEdit={handleItemEdit}
        onItemEditFinish={handleItemEditFinish}
      />

      {!editedData && (
        <Button
          title="Transformar em Smart Bill"
          onPress={handleImageProcessing}
          variant="primary"
        />
      )}
      <View style={{ gap: 10 }}>
        {editedData?.items && (
          <Button
            title="Salvar Smart Bill"
            onPress={handleSaveSmartBill}
            variant="primary"
          />
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </View>
  );
}
