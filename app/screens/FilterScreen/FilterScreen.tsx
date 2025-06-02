import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import {
  getAllCategories,
  getAllEstablishments,
  getAllProducts,
  getAllSmartBills,
} from "@/services/database/queries";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styles from "./styleFilterScreen";

type DataType = "products" | "establishments" | "smartbills" | "categories";

interface BaseItem {
  id: number;
  name: string;
  total_spent: number;
}

export default function FilterScreen() {
  const [data, setData] = useState<Array<BaseItem & Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DataType>("products");

  const options = [
    { label: "Produtos", value: "products" as const },
    { label: "Estabelecimentos", value: "establishments" as const },
    { label: "Smartbills", value: "smartbills" as const },
    { label: "Categorias", value: "categories" as const },
  ];

  const fetchData = async (type: DataType) => {
    try {
      setLoading(true);
      setError(null);

      switch (type) {
        case "products": {
          const products = await getAllProducts();
          setData(
            products.map((p) => ({
              ...p,
              total_spent: p.unit_price * (p.quantity || 1),
              name: p.name,
              id: p.id,
            }))
          );
          break;
        }

        case "categories": {
          const categories = await getAllCategories();
          setData(
            categories.map((c) => ({
              ...c,
              total_spent: c.total_spent || 0,
              name: c.name,
              id: c.id,
            }))
          );
          break;
        }

        case "establishments": {
          const establishments = await getAllEstablishments();
          setData(
            establishments.map((e) => ({
              ...e,
              total_spent: e.total_spent || 0,
              name: e.name,
              id: e.id,
              location: e.location,
              bill_count: e.bill_count,
              last_visit: e.last_visit,
            }))
          );
          break;
        }

        case "smartbills": {
          const smartbills = await getAllSmartBills();
          setData(
            smartbills.map((sb) => ({
              ...sb,
              total_spent: sb.total_amount || 0,
              name: `${sb.establishment_name} - ${sb.purchase_date}`,
              id: sb.id,
              date: sb.purchase_date,
              time: sb.purchase_time,
              establishment: sb.establishment_name,
              location: sb.establishment_location,
              item_count: sb.item_count,
            }))
          );
          break;
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
      setError(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption]);

  const handleOptionSelect = (option: DataType) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const renderItemContent = (item: any) => {
    const formatPrice = (price: number | undefined) => {
      return (price || 0).toFixed(2);
    };

    switch (selectedOption) {
      case "products":
        return `${item.name} | ${formatPrice(item.unit_price)}€ | ${
          item.quantity || 0
        }`;

      case "categories":
        return `${item.name} | ${formatPrice(item.total_spent)}€`;

      case "establishments":
        return `${item.name} | ${item.location || "N/A"} | ${
          item.bill_count || 0
        } bill | ${formatPrice(item.total_spent)}€`;

      case "smartbills":
        return `${item.establishment || "N/A"} | ${item.date || "N/A"} | ${
          item.item_count || 0
        } produtos | ${formatPrice(item.total_spent)}€`;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ position: "relative" }}>
          <TopText
            first={
              options.find((o) => o.value === selectedOption)?.label ||
              "Produtos"
            }
            second=" na minha"
            third="Smart Bill"
            clickable={true}
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {showDropdown && (
            <View style={styles.dropdown}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => handleOptionSelect(option.value)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, marginTop: 16 }}>
          <ItemsOverview
            items={data}
            showButtons={false}
            showGraph={true}
            onItemPress={(item) => console.log("Item pressed:", item)}
            renderItemContent={renderItemContent}
            showSearch={true}
          />
        </View>
      </View>
    </View>
  );
}
