import Button from "@/components/Buttons/Button";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import TopText from "@/components/TopText/TopText";
import { getAllProducts, ProductResult } from "@/services/database/queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import styles from "./styleHomeScreen";

const HomeScreen = () => {
  const navigation = useNavigation() as any;
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(20);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      }
    };

    fetchProducts();
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
      <TopText first="A minha" second="Smart Bill" />
      {products.length > 0 && <DonutGraph />}
      <View>
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
    </View>
  );
};

export default HomeScreen;
