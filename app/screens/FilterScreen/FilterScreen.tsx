import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import { getAllProducts } from "@/services/database/queries";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function FilterScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View
        style={[{ flex: 1, justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[{ flex: 1, justifyContent: "center", alignItems: "center" }]}
      >
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TopText
          first="Produtos"
          second=" na minha"
          third="Smart Bill"
          clickable={true}
        />

        <View style={{ flex: 1, marginTop: 16 }}>
          <ItemsOverview
            items={products.map((product) => ({
              ...product,
              // Add a total_spent field that ItemsOverview expects for the graph
              total_spent: product.unit_price * (product.quantity || 1),
            }))}
            showButtons={false}
            showGraph={true}
            onItemPress={(product) => console.log("Product pressed:", product)}
            renderItemContent={(item) =>
              `${item.name} - ${(
                item.unit_price * (item.quantity || 1)
              ).toFixed(2)}€`
            }
          />
        </View>
      </View>
    </View>
  );
}
