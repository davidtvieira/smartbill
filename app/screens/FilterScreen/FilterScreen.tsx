import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import ItemDetailsModal from "@/components/Modals/ItemDetailsModal/ItemDetailsModal";
import TopText from "@/components/TopText/TopText";
import {
  getMonthlyCategories,
  getMonthlyEstablishments,
  getMonthlyProducts,
  getMonthlySmartBills,
  getSmartBillsByEstablishment,
} from "@/services/database/queries";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styleFilterScreen";

export type DataType =
  | "products"
  | "establishments"
  | "smartbills"
  | "categories";

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
  const [selectedEstablishment, setSelectedEstablishment] = useState<
    number | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const options = [
    { label: "Produtos", value: "products" as const },
    { label: "Categorias", value: "categories" as const },
    { label: "Estabelecimentos", value: "establishments" as const },
    { label: "Smartbills", value: "smartbills" as const },
  ];

  type DataMapper<T> = {
    fetchFn: () => Promise<T[]>;
    totalSpent: (item: T) => number;
    name: (item: T) => string;
    id: (item: T) => string | number;
    renderSubtitle?: (item: T) => string;
  };

  const dataMappers: Record<DataType, DataMapper<any>> = {
    products: {
      fetchFn: getMonthlyProducts,
      totalSpent: (p) => p.unit_price * (p.quantity || 1),
      name: (p) => p.name,
      id: (p) => p.id,
    },
    categories: {
      fetchFn: getMonthlyCategories,
      totalSpent: (c) => c.total_spent || 0,
      name: (c) => c.name,
      id: (c) => c.id,
    },
    establishments: {
      fetchFn: getMonthlyEstablishments,
      totalSpent: (e) => e.total_spent || 0,
      name: (e) => e.name,
      id: (e) => e.id,
      renderSubtitle: (e) => `Última visita: ${e.last_visit}`,
    },
    smartbills: {
      fetchFn: async () => {
        if (selectedEstablishment) {
          return getSmartBillsByEstablishment(selectedEstablishment);
        }
        return getMonthlySmartBills();
      },
      totalSpent: (sb) => sb.amount || 0,
      name: (sb) => sb.establishment_name,
      id: (sb) => sb.id,
    },
  };

  const fetchData = async (type: DataType) => {
    try {
      setError(null);
      const { fetchFn, totalSpent, name, id } = dataMappers[type];
      const items = await fetchFn();

      setData(
        items.map((item) => ({
          ...item,
          total_spent: totalSpent(item),
          name: name(item),
          id: id(item),
        }))
      );
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
      setError(`Failed to load ${type}`);
      setData([]);
    }
  };

  const handleItemPress = async (item: any) => {
    if (selectedOption === "products" || selectedOption === "smartbills") {
      setSelectedItem(item);
      setShowItemModal(true);
    } else if (selectedOption === "establishments") {
      setSelectedEstablishment(item.id);
      setSelectedOption("smartbills");
    }
  };

  const handleOptionSelect = (option: DataType) => {
    setSelectedOption(option);
    setSelectedEstablishment(null);
    setShowDropdown(false);
  };

  useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption, selectedEstablishment]);

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
            onItemPress={handleItemPress}
            showSearch={true}
            showButtons={false}
            dataType={selectedOption}
          />
        </View>
      </View>
      <ItemDetailsModal
        visible={showItemModal}
        selectedItem={selectedItem}
        selectedOption={selectedOption}
        onClose={() => {
          setShowItemModal(false);
          setSelectedItem(null);
        }}
      />
    </View>
  );
}
