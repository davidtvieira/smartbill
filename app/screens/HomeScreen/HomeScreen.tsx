import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import {
  CategoryWithSpending,
  getAllCategories,
} from "@/services/database/queries";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styleHomeScreen";
const HomeScreen = () => {
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
      <TopText first="A minha" third="Smart Bill" />
      <ItemsOverview
        items={categories.map((category) => ({
          id: category.id,
          name: category.name,
          total_spent: category.total_spent || 0,
        }))}
        showButtons={true}
        showGraph={true}
        onItemPress={(category) => console.log("Category pressed:", category)}
        renderItemContent={(item) => `${item.name} - ${item.total_spent}€`}
      />
    </View>
  );
};

export default HomeScreen;
