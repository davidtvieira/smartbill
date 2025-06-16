import Button from "@/components/Buttons/Button/Button";
import TopText from "@/components/TopText/TopText";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styleSetting";

const MODEL_OPTIONS = [
  {
    label: "Gemini 1.5 Flash",
    value:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  },
];

export default function Settings() {
  const navigation = useNavigation();
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // useEffect para buscar dados
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedApiKey, savedModel] = await Promise.all([
          AsyncStorage.getItem("geminiApiKey"),
          AsyncStorage.getItem("aiModelEndpoint"),
        ]);

        if (savedApiKey) setApiKey(savedApiKey);
        if (savedModel) setSelectedModel(savedModel);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    loadSettings();
  }, []);

  // Função para salvar as configurações
  const handleSave = async () => {
    if (!apiKey.trim()) {
      setSaveMessage({
        text: "Por favor, insira uma chave da API",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await Promise.all([
        AsyncStorage.setItem("geminiApiKey", apiKey.trim()),
        AsyncStorage.setItem("aiModelEndpoint", selectedModel),
      ]);

      navigation.goBack();
    } catch (error) {
      console.error("Failed to save settings", error);
      setSaveMessage({
        text: "Erro ao salvar as configurações",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para obter o modelo
  const getModelDisplayName = (url: string) => {
    const model = MODEL_OPTIONS.find((opt) => opt.value === url);
    return model ? model.label : "Modelo personalizado";
  };

  return (
    <View style={styles.container}>
      <TopText first="Definições" second=" na minha" third="Smart Bill" />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Modelo de IA</Text>
        <View>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowModelDropdown(!showModelDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {getModelDisplayName(selectedModel)}
            </Text>
          </TouchableOpacity>

          {showModelDropdown && (
            <View style={styles.dropdown}>
              {MODEL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => {
                    setSelectedModel(option.value);
                    setShowModelDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.apiKeyContainer}>
          <Text style={styles.label}>Chave da API</Text>
          <TouchableOpacity
            onPress={() =>
              // Abre a página de ajuda para ter a chave da API
              Linking.openURL(
                "https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web&hl=pt"
              )
            }
          >
            <MaterialIcons
              name="help-outline"
              style={styles.label}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Insira sua chave da API"
          placeholderTextColor="gray"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.helperText}>
          Esta chave da API é armazenada apenas neste dispositivo.
        </Text>

        {saveMessage && (
          <Text
            style={[
              styles.messageText,
              saveMessage.type === "success"
                ? styles.successText
                : styles.errorText,
            ]}
          >
            {saveMessage.text}
          </Text>
        )}

        <Button
          title={isSaving ? "A guardar..." : "Guardar"}
          onPress={handleSave}
          variant="primary"
        />
      </View>
    </View>
  );
}
