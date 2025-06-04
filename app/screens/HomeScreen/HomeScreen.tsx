import Button from "@/components/Buttons/Button/Button";
import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import {
  CategoryWithSpending,
  getAllCategories,
} from "@/services/database/queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styleHomeScreen";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<CategoryWithSpending[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
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
        showButtons={true}
        showGraph={true}
        onItemPress={(category) => console.log("Category pressed:", category)}
        showSearch={false}
        renderSubtitle={(item) =>
          item.subcategory_count
            ? `${item.subcategory_count} subcategoria${
                item.subcategory_count !== 1 ? "s" : ""
              }`
            : "Sem subcategorias"
        }
      />
    </View>
  );
}
