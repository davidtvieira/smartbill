// app/screens/HomeScreen/HomeScreen.tsx
import Button from "@/components/Buttons/Button/Button";
import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import { getWeeklyCategories } from "@/services/database/queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styleHomeScreen";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getWeeklyCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Falha ao carregar categorias:", err);
        setError("Falha ao carregar categorias");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const totalSpent = categories.reduce(
    (sum, category) => sum + (category.total_spent || 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          title={"Definições"}
          onPress={() => navigation.navigate("SettingsScreen" as never)}
          variant="onlyText"
        />
      </View>

      <View>
        <TopText first="A minha" third="Smart Bill" />
      </View>

      <ItemsOverview
        items={categories}
        onItemPress={() => {}}
        showButtons={true}
        showGraph={true}
        showSearch={false}
        renderSubtitle={(category) =>
          category.subcategory_count
            ? `${category.subcategory_count} subcategoria${
                category.subcategory_count !== 1 ? "s" : ""
              }`
            : "Sem subcategorias"
        }
      />
    </View>
  );
}
