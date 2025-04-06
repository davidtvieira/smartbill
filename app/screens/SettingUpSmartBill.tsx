import Button from "@/components/buttons/Button";
import TopText from "@/components/TopText/TopTex";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";

const prompt = `
Extrai o texto todo desta imagem, apresenta o texto extraido em formato json, com o conteudo
local, hora, data, e os items comprados, dentro dos items comprados, o titulo, a quantidade e o preco unitario
Para cada titulo ou nome de loca que aches que esteja incompleto, completa o tu, sem ser extensivo, simplesmente completar a palavra.
Remove caracteres que nao te parecam fazer parte, como / ou |.
No Local, apenas coloca a cidadem nao coloques ruas, nem entradas de portas nem nada especifico, apenas o local.
`;

export default function SettingUpSmartBill() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setExtractedText(extractedText);
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
    <View
      style={{
        gap: 20,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <TopText first="configurar" second="Smart Bill" />

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

      {loading && <ActivityIndicator size="large" color="#000" />}
      {extractedText && (
        <View style={{ padding: 10, backgroundColor: "#eee", borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Texto extraído:
          </Text>
          <Text style={{ marginTop: 8 }}>{extractedText}</Text>
        </View>
      )}

      <Button
        title="Transformar em Smart Bill"
        onPress={handleImageProcessing}
        variant="primary"
      />
      <Button
        title="Adicionar mais imagens"
        onPress={() => console.log("Adicionar mais imagens")}
        variant="disabled"
      />
      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        variant="secondary"
      />
    </View>
  );
}
