import Button from "@/components/Buttons/Button/Button";
import ImagePreview from "@/components/ImagePreview/ImagePreview";
import EditingModal from "@/components/Modals/EditingModal/EditingModal";
import ReviewPanel from "@/components/SettingUpSmartBill/ReviewPanel";
import TopText from "@/components/TopText/TopText";
import { Api_Call } from "@/services/API/api_call";
import { insertSmartBill } from "@/services/database/insert";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export type SmartBillData = {
  local: string;
  establishment: string;
  date: string;
  time: string;
  items: {
    name: string;
    quantity: number;
    unit_price: number;
    category: string;
    sub_category: string;
  }[];
};

export default function SettingUpSmartBill() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  const [loading, setLoading] = useState(false);
  const [editedData, setEditedData] = useState<SmartBillData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(false);

  const handleSaveSmartBill = async () => {
    if (!editedData) return;

    const requiredFields: (keyof SmartBillData)[] = [
      "local",
      "establishment",
      "date",
      "time",
    ];
    const missingFields = requiredFields.filter((field) => !editedData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        "Erro ao adicionar Smart Bill",
        "Por favor, preencha todos os campos obrigatórios"
      );
      return;
    }

    try {
      await insertSmartBill(editedData);
      console.log("Smart Bill added successfully");
      navigation.navigate("Home" as never);
    } catch (error) {
      console.error("Erro ao inserir Smart Bill:", error);
    }
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
    field: "name" | "quantity" | "unit_price" | "category" | "sub_category",
    value: string
  ) => {
    if (!editedData) return;
    const updatedItems = [...editedData.items];
    if (field === "quantity" || field === "unit_price") {
      const numericValue =
        field === "quantity" ? parseInt(value) : parseFloat(value);
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
      const parsedData = await Api_Call(imageUri);
      setEditedData(parsedData);
    } catch (error: any) {
      console.error("Gemini Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: 20, padding: 20, justifyContent: "center", flex: 1 }}>
      <TopText first="configurar" third="Smart Bill" />

      {!editedData && <ImagePreview imageUri={imageUri} loading={loading} />}

      {editedData && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <ReviewPanel
            data={editedData}
            onFieldEdit={handleFieldEdit}
            onItemEditStart={handleItemEditStart}
          />
        </ScrollView>
      )}

      <EditingModal
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
            title="Adicionar Smart Bill"
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
