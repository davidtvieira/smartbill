import Button from "@/components/buttons/Button";
import TopText from "@/components/TopText/TopTex";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  TextInput,
  View,
} from "react-native";

const prompt = `
Extrai da imagem o conteúdo do recibo em formato JSON.
Não incluas aspas na tua resposta, sejam simples ou duplas.
A estrutura deve ser:

{
  "local": "cidade onde foi feita a compra",
  "estabelecimento: "nome do estabelecimento",
  "data": "formato DD-MM-AAAA",
  "hora": "formato HH:MM",
  "items": [
    {
      "titulo": "nome do produto",
      "quantidade": número inteiro,
      "preco_unitario": número decimal
    }
  ]
}

Completa nomes incompletos (ex: "Lisbo" -> "Lisboa"). Não uses caracteres inválidos como "/" ou "|". No campo "local", apenas a cidade, não incluas moradas ou números de porta.
`;

export default function SettingUpSmartBill() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isItemEditing, setIsItemEditing] = useState(false);

  const handleImageProcessing = async () => {
    setLoading(true);
    const apiKey = "YOUR_API_KEY";

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64Image = base64data.split(",")[1];

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: blob.type || "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await geminiResponse.json();

      if (
        !geminiResponse.ok ||
        !result.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        throw new Error(result.error?.message || "Failed to process image");
      }

      const extractedText = result.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(extractedText);

      setExtractedData(parsedData);
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

  const handleSaveSmartBill = () => {
    const jsonData = JSON.stringify(editedData, null, 2);
    console.log("Smart Bill Guardado:\n", jsonData);
  };

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
    setModalVisible(true);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleItemEdit = (index: number, field: string, value: string) => {
    const updatedItems = [...editedData.items];
    updatedItems[index][field] = value;
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

  return (
    <View
      style={{
        gap: 20,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <TopText first="configurar" second="Smart Bill" />

      {!editedData && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 10,
            }}
          />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#000" />}

      {editedData && (
        <View>
          <Button
            title={editedData.local || "Local"}
            variant="secondary"
            onPress={() => handleFieldEdit("local")}
          />
          <Button
            title={editedData.estabelecimento || "Estabelecimento"}
            variant="secondary"
            onPress={() => handleFieldEdit("estabelecimento")}
          />
          <Button
            title={editedData.data || "Data (DD-MM-AAAA)"}
            variant="secondary"
            onPress={() => handleFieldEdit("data")}
          />
          <Button
            title={editedData.hora || "Hora (HH:MM)"}
            variant="secondary"
            onPress={() => handleFieldEdit("hora")}
          />

          {editedData.items?.map((item: any, index: number) => (
            <View key={index}>
              <Button
                title={`${item.titulo} - Qtd: ${
                  item.quantidade
                } - €${item.preco_unitario.toFixed(2)}`}
                variant="secondary"
                onPress={() => handleItemEditStart(index)}
              />
            </View>
          ))}

          {modalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              onDismiss={() => setModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 300,
                    padding: 20,
                    backgroundColor: "#273C47",
                    borderRadius: 10,
                  }}
                >
                  {editingField && !editingField.startsWith("item") && (
                    <TextInput
                      value={
                        editedData[editingField as keyof typeof editedData]
                      }
                      onChangeText={(text) =>
                        handleFieldChange(editingField, text)
                      }
                      placeholder={editingField}
                    />
                  )}

                  {editingField?.startsWith("item") && isItemEditing && (
                    <View>
                      <TextInput
                        value={
                          editedData.items[parseInt(editingField.split("-")[1])]
                            .titulo
                        }
                        onChangeText={(text) =>
                          handleItemEdit(
                            parseInt(editingField.split("-")[1]),
                            "titulo",
                            text
                          )
                        }
                        placeholder="Título do Produto"
                      />
                      <TextInput
                        value={String(
                          editedData.items[parseInt(editingField.split("-")[1])]
                            .quantidade
                        )}
                        onChangeText={(text) =>
                          handleItemEdit(
                            parseInt(editingField.split("-")[1]),
                            "quantidade",
                            text
                          )
                        }
                        placeholder="Quantidade"
                        keyboardType="numeric"
                      />
                      <TextInput
                        value={String(
                          editedData.items[parseInt(editingField.split("-")[1])]
                            .preco_unitario
                        )}
                        onChangeText={(text) =>
                          handleItemEdit(
                            parseInt(editingField.split("-")[1]),
                            "preco_unitario",
                            text
                          )
                        }
                        placeholder="Preço Unitário"
                        keyboardType="numeric"
                      />
                    </View>
                  )}

                  <Button
                    title="Atualizar"
                    variant="primary"
                    onPress={() => {
                      setModalVisible(false);
                      if (isItemEditing) handleItemEditFinish();
                    }}
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}

      {!editedData && (
        <Button
          title="Transformar em Smart Bill"
          onPress={handleImageProcessing}
          variant="primary"
        />
      )}

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
  );
}
