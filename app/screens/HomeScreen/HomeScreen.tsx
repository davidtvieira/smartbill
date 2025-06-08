// app/screens/HomeScreen/HomeScreen.tsx
import Button from "@/components/Buttons/Button/Button";
import ItemButton from "@/components/Buttons/ItemButton/ItemButton";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import TopText from "@/components/TopText/TopText";
import { getCategories } from "@/services/database/queries";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
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
          onPress={() => navigation.navigate("SettingsScreen" as never)}
          variant="onlyText"
        />
      </View>

      <View>
        <TopText first="A minha" third="Smart Bill" />
      </View>

      <View style={styles.container}>
        <DonutGraph
          totalSpent={categories.reduce(
            (acc, curr) => acc + curr.total_spent,
            0
          )}
          content={categories.map((item) => ({
            name: item.name,
            total_spent: item.total_spent,
          }))}
          size={250}
        />

        <View>
          <View>
            <Button
              icon={
                <MaterialCommunityIcons name="camera" size={24} color="white" />
              }
              title="Smart Bill"
              onPress={() => navigation.navigate("AddSmartBill" as never)}
              variant="primary"
            />

            <View style={styles.buttonsContainer}>
              <Text style={styles.titleText}>Últimos 7 Dias</Text>
              <Button
                title="Ver todos"
                onPress={() => navigation.navigate("FilterScreen" as never)}
                variant="onlyText"
              />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
        >
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
                onPress={() => console.log(item)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
