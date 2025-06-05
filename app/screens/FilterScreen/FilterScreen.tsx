import ItemsOverview from "@/components/ItemsOverview/ItemsOverview";
import ItemDetailsModal from "@/components/Modals/ItemDetailsModal/ItemDetailsModal";
import TopText from "@/components/TopText/TopText";
import {
  getThisMonthCategories,
  getThisMonthEstablishments,
  getThisMonthProducts,
  getThisMonthProductsBySubcategory,
  getThisMonthSmartBills,
  getThisMonthSmartBillsByEstablishment,
  getThisMonthSubcategories,
} from "@/services/database/queries";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styleFilterScreen";

export type DataType =
  | "products"
  | "establishments"
  | "smartbills"
  | "categories"
  | "subcategories"
  | "subcategory-products";

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
  const [selectedEstablishmentName, setSelectedEstablishmentName] =
    useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>("");

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
      fetchFn: getThisMonthProducts,
      totalSpent: (p) => p.unit_price * (p.quantity || 1),
      name: (p) => p.name,
      id: (p) => p.id,
      renderSubtitle: (p) => `${p.category_name}`,
    },
    categories: {
      fetchFn: getThisMonthCategories,
      totalSpent: (c) => c.total_spent || 0,
      name: (c) => c.name,
      id: (c) => c.id,
      renderSubtitle: (c) => `Subcategorias: ${c.subcategory_count}`,
    },
    subcategories: {
      fetchFn: async () => {
        if (!selectedCategory) return [];
        return getThisMonthSubcategories(selectedCategory);
      },
      totalSpent: (s) => s.total_spent || 0,
      name: (s) => s.name,
      id: (s) => s.id,
      renderSubtitle: (s) => `${s.item_count || 0} itens`,
    },
    establishments: {
      fetchFn: getThisMonthEstablishments,
      totalSpent: (e) => e.total_spent || 0,
      name: (e) => e.name,
      id: (e) => e.id,
      renderSubtitle: (e) => `smartbills:  ${e.bill_count}`,
    },
    smartbills: {
      fetchFn: async () => {
        if (selectedEstablishment) {
          return getThisMonthSmartBillsByEstablishment(selectedEstablishment);
        }
        return getThisMonthSmartBills();
      },
      totalSpent: (sb) => sb.amount || 0,
      name: (sb) => sb.establishment_name,
      id: (sb) => sb.id,
      renderSubtitle: (sb) => `${sb.purchase_date} | ${sb.item_count} produtos`,
    },
    "subcategory-products": {
      fetchFn: async () => {
        if (!selectedSubcategory) return [];
        return getThisMonthProductsBySubcategory(selectedSubcategory);
      },
      totalSpent: (p) => p.unit_price * (p.quantity || 1),
      name: (p) => p.name,
      id: (p) => p.id,
      renderSubtitle: (p) => `${p.establishment_name}`,
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

  const handleItemPress = (item: any) => {
    if (
      selectedOption === "products" ||
      selectedOption === "smartbills" ||
      selectedOption === "subcategory-products"
    ) {
      if (selectedOption === "subcategory-products") {
        setSelectedItem({
          ...item,
          subcategory_name: selectedSubcategoryName,
        });
      } else {
        setSelectedItem(item);
      }
      setShowItemModal(true);
    } else if (selectedOption === "establishments") {
      setSelectedEstablishment(item.id);
      setSelectedEstablishmentName(item.name);
      setSelectedOption("smartbills");
      setShowBackButton(true);
    } else if (selectedOption === "categories") {
      setSelectedCategory(item.id);
      setSelectedCategoryName(item.name);
      setSelectedOption("subcategories");
      setShowBackButton(true);
    } else if (selectedOption === "subcategories") {
      setSelectedSubcategory(item.id);
      setSelectedSubcategoryName(item.name);
      setSelectedOption("subcategory-products");
      setShowBackButton(true);
    }
  };

  const handleBack = () => {
    if (selectedOption === "subcategory-products") {
      setSelectedOption("subcategories");
      setSelectedSubcategory(null);
      setSelectedSubcategoryName("");
    } else if (selectedOption === "subcategories") {
      setSelectedOption("categories");
      setSelectedCategory(null);
      setSelectedCategoryName("");
      setSelectedSubcategory(null);
      setSelectedSubcategoryName("");
    } else if (selectedOption === "smartbills") {
      setSelectedOption("establishments");
      setSelectedEstablishment(null);
      setSelectedEstablishmentName("");
    }
    setShowBackButton(
      selectedOption !== "categories" && selectedOption !== "establishments"
    );
  };

  const handleOptionSelect = (option: DataType) => {
    setSelectedOption(option);
    setSelectedEstablishment(null);
    setSelectedEstablishmentName("");
    setSelectedCategory(null);
    setSelectedCategoryName("");
    setSelectedSubcategory(null);
    setSelectedSubcategoryName("");
    setShowBackButton(false);
    setShowDropdown(false);
  };

  useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption, selectedEstablishment, selectedCategory]);

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
          <View>
            {showBackButton && (
              <TouchableOpacity onPress={handleBack}>
                <Text>←</Text>
              </TouchableOpacity>
            )}
            <TopText
              first={
                selectedOption === "subcategory-products"
                  ? selectedSubcategoryName || "Produtos"
                  : selectedOption === "subcategories"
                  ? selectedCategoryName || "Categoria"
                  : selectedEstablishment
                  ? selectedEstablishmentName || "Estabelecimento"
                  : options.find((o) => o.value === selectedOption)?.label ||
                    "Produtos"
              }
              second={" na minha"}
              third={
                selectedOption === "subcategories" ||
                selectedOption === "subcategory-products"
                  ? ""
                  : "Smart Bill"
              }
              clickable={true}
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </View>

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
        <View style={{ flex: 1 }}>
          <ItemsOverview
            items={data}
            onItemPress={handleItemPress}
            headerText="Este Mês"
            showSearch={true}
            showButtons={false}
            dataType={selectedOption}
            renderSubtitle={dataMappers[selectedOption]?.renderSubtitle}
          />
        </View>
      </View>
      <ItemDetailsModal
        visible={showItemModal}
        selectedItem={selectedItem}
        selectedOption={selectedOption}
        onClose={() => {
          setShowItemModal(false);
        }}
        onDelete={() => {
          fetchData(selectedOption);
          setShowItemModal(false);
        }}
      />
    </View>
  );
}
