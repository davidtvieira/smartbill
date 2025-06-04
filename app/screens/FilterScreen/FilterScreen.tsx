import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import TopText from "@/components/TopText/TopText";
import {
  getAllCategories,
  getAllEstablishments,
  getAllProducts,
  getAllSmartBills,
} from "@/services/database/queries";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styleFilterScreen";

type DataType = "products" | "establishments" | "smartbills" | "categories";

interface BaseItem {
  id: number;
  name: string;
  total_spent: number;
}

export default function FilterScreen() {
  const [data, setData] = useState<Array<BaseItem & Record<string, any>>>([]);

  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DataType>("products");

  const options = [
    { label: "Produtos", value: "products" as const },
    { label: "Categorias", value: "categories" as const },
    { label: "Estabelecimentos", value: "establishments" as const },
    { label: "Smartbills", value: "smartbills" as const },
  ];

  const fetchData = async (type: DataType) => {
    try {
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
              name: `${sb.establishment_name} `,
              id: sb.id,
            }))
          );
          break;
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
      setError(`Failed to load ${type}`);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption]);

  const handleOptionSelect = (option: DataType) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

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
        <View>
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
            onItemPress={(item) => {
              // Handle item press
              console.log("Item pressed:", item);
            }}
            showSearch={true}
            showButtons={false}
            renderTitle={(item) => {
              switch (selectedOption) {
                case "smartbills":
                  return item.establishment_name || item.name;
                default:
                  return item.name;
              }
            }}
            renderSubtitle={(item) => {
              switch (selectedOption) {
                case "products":
                  return item.category_name || "";
                case "categories":
                  return item.subcategory_count
                    ? `${item.subcategory_count} subcategorias`
                    : "Sem subcategorias";
                case "establishments":
                  return item.bill_count ? `${item.bill_count} smartbill` : "";
                case "smartbills":
                  return item.purchase_date && item.item_count
                    ? `${item.purchase_date} | ${item.item_count} produtos`
                    : "";
                default:
                  return "";
              }
            }}
            renderValue={(item) => `€${item.total_spent.toFixed(2)}`}
          />
        </View>
      </View>
    </View>
  );
}
