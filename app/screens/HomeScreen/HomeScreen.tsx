import Button from "@/components/Buttons/Button/Button";
import ItemButton from "@/components/Buttons/ItemButton/ItemButton";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import TopText from "@/components/TopText/TopText";
import { getCategories } from "@/services/database/queries";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import styles from "./styleHomeScreen";

type BaseItem = {
  id: string | number;
  name: string;
  total_spent: number;
  category_name?: string;
  quantity?: number;
  unit_price?: number;
  subcategory_count?: number;
  [key: string]: any;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<BaseItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const fetchData = useCallback(async () => {
    const today = new Date();
    const lastWeek = new Date(today);
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    lastWeek.setDate(today.getDate() - 6);

    setLoading(true);
    try {
      const categoriesData = await getCategories(
        formatDate(lastWeek),
        formatDate(today)
      );
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error("Falha ao carregar categorias:", err);
      setError("Falha ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkApiKey = useCallback(async () => {
    try {
      const apiKey = await AsyncStorage.getItem("geminiApiKey");
      setHasApiKey(!!apiKey);
    } catch (error) {
      console.error("Error checking API key:", error);
      setHasApiKey(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      checkApiKey();
    }, [fetchData, checkApiKey])
  );

  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <Button
          icon={
            <MaterialCommunityIcons name="wrench" size={24} color="white" />
          }
          onPress={() => navigation.navigate("Settings" as never)}
          variant="onlyText"
        />
      </View>

      <View>
        <TopText first="A minha" third="Smart Bill" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DonutGraph
            totalSpent={categories.reduce(
              (acc, cur) => acc + cur.total_spent,
              0
            )}
            size={200}
            content={categories}
          />

          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="camera"
                    size={24}
                    color="white"
                  />
                }
                title="Adicionar uma Smart Bill"
                onPress={() => {
                  if (!hasApiKey) {
                    Alert.alert(
                      "Chave da API Necessária",
                      "Para usar o Smart Bill, por favor adicione uma chave da API nas Configurações.",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Ir para Configurações",
                          onPress: () =>
                            navigation.navigate("Settings" as never),
                        },
                      ]
                    );
                    return;
                  }
                  navigation.navigate("AddSmartBill" as never);
                }}
                variant={hasApiKey ? "primary" : "secondary"}
                disabled={!hasApiKey}
              />
              {!hasApiKey && (
                <Text style={styles.apiKeyMessage}>
                  <MaterialCommunityIcons
                    name="alert"
                    size={16}
                    style={styles.infoIcon}
                  />{" "}
                  Adicione uma chave da API nas Configurações para começar a
                  usar a Smart Bill
                </Text>
              )}
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Guardadas"
                  onPress={() => navigation.navigate("SeeAll" as never)}
                  variant="third"
                  icon={
                    <MaterialCommunityIcons
                      name="format-list-checks"
                      size={24}
                      color="white"
                    />
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
        >
          <View>
            <Text style={styles.titleText}>Últimos 7 Dias</Text>
          </View>
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : categories.length === 0 ? (
            <View style={styles.noItemsContainer}>
              <Text style={styles.noItemsText}>
                Nenhuma categoria encontrada
              </Text>
            </View>
          ) : (
            categories.map((item) => (
              <ItemButton
                key={`${item.id}-${item.name}`}
                title={truncateName(item.name)}
                subtitle={
                  item.subcategory_count
                    ? `${item.subcategory_count} subcategoria${
                        item.subcategory_count !== 1 ? "s" : ""
                      }`
                    : "Sem subcategorias"
                }
                value={`${item.total_spent.toFixed(2)}€`}
                disabled
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
