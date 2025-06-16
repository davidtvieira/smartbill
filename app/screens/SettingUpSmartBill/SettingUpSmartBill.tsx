import Button from "@/components/Buttons/Button/Button";
import ImagePreview from "@/components/ImagePreview/ImagePreview";
import EditingModal from "@/components/Modals/EditingModal/EditingModal";
import ReviewPanel from "@/components/ReviewPanel/ReviewPanel";
import TopText from "@/components/TopText/TopText";
import { Api_Call } from "@/services/API/api_call";
import { insertSmartBill } from "@/services/database/insert";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import styles from "./styleSettingUpSmartBill";

// Tipos de dados
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

  // Função para salvar a Smart Bill
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

    const invalidItems = editedData.items.filter(
      (item) => item.quantity <= 0 || item.unit_price <= 0
    );

    if (invalidItems.length > 0) {
      Alert.alert(
        "Erro ao adicionar Smart Bill",
        "Por favor, verifique se todos os itens têm quantidade e preço unitário maiores que 0"
      );
      return;
    }

    try {
      await insertSmartBill(editedData);
      navigation.navigate("HomeScreen" as never);
    } catch (error) {
      console.error("Erro ao inserir Smart Bill:", error);
    }
  };

  // Função para editar um campo
  const handleFieldEdit = (field: keyof SmartBillData) => {
    setEditingField(field);
    setModalVisible(true);
  };

  // Função para atualizar um campo
  const handleFieldChange = (field: keyof SmartBillData, value: string) => {
    setEditedData((prevData) =>
      prevData ? { ...prevData, [field]: value } : null
    );
  };

  // Função para editar um item
  const handleItemEdit = (
    index: number,
    field: "name" | "quantity" | "unit_price" | "category" | "sub_category",
    value: string
  ) => {
    if (!editedData) return;
    const updatedItems = [...editedData.items];
    if (field === "quantity" || field === "unit_price") {
      if (value === "") {
        updatedItems[index][field] = 0 as never;
      } else {
        const sanitizedValue = value.replace(",", ".");
        const numericValue = Number(sanitizedValue);
        updatedItems[index][field] = (
          isNaN(numericValue) ? 0 : numericValue
        ) as never;
      }
    } else {
      updatedItems[index][field] = value as never;
    }
    setEditedData((prevData) =>
      prevData ? { ...prevData, items: updatedItems } : null
    );
  };

  // Função para iniciar a edição de um item
  const handleItemEditStart = (index: number) => {
    setEditingField(`item-${index}`);
    setIsItemEditing(true);
    setModalVisible(true);
  };

  // Função para finalizar a edição de um item
  const handleItemEditFinish = () => {
    setIsItemEditing(false);
  };

  // Função para processar a imagem
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
    <View style={styles.container}>
      <TopText first="Configurar" third="Smart Bill" />
      <View>
        {!editedData && <ImagePreview imageUri={imageUri} loading={loading} />}
      </View>

      {editedData && (
        <ScrollView style={{ flex: 1 }}>
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
      <View style={{ paddingTop: 20, gap: 10 }}>
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
            variant="third"
          />
        </View>
      </View>
    </View>
  );
}
