import Button from "@/components/Buttons/Button/Button";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import TopText from "@/components/TopText/TopText";
import {
  CategorySpending,
  getAllProducts,
  getCurrentMonthCategorySpending,
  getCurrentMonthTotalSpent,
  ProductResult,
} from "@/services/database/queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import styles from "./styleHomeScreen";

const HomeScreen = () => {
  const navigation = useNavigation() as any;
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, total, categories] = await Promise.all([
          getAllProducts(10),
          getCurrentMonthTotalSpent(),
          getCurrentMonthCategorySpending(),
        ]);

        setProducts(productsData);
        setTotalSpent(total);
        setCategorySpending(categories);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const renderProductItem = ({ item }: { item: ProductResult }) => (
    <View>
      <Button
        title={`${item.name} - €${item.unit_price.toFixed(2)}`}
        onPress={() => {
          console.log("Product pressed");
        }}
        variant="secondary"
      />
    </View>
  );

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
      <DonutGraph
        totalSpent={totalSpent}
        content={categorySpending}
        size={250}
      />
      <View style={{ flex: 1 }}>
        <Button
          title="Smart Bill"
          onPress={() => navigation.navigate("AddSmartBill")}
          variant="primary"
        />
        <View style={styles.rowButtons}>
          <Button
            title="Receitas"
            onPress={() => console.log("Receitas clicked")}
            variant="disabled"
          />
          <Button
            title="Dividir Despesas"
            onPress={() => console.log("Dividir Despesas clicked")}
            variant="disabled"
          />
        </View>
        {products.length > 0 && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 25, fontWeight: "bold", color: "white" }}
              >
                Produtos
              </Text>
              <Button
                title="Ver Todos"
                onPress={() => navigation.navigate("FilterScreen")}
                variant="clear"
              />
            </View>
            <View style={styles.listContainer}>
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
