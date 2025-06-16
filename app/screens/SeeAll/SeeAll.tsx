import Button from "@/components/Buttons/Button/Button";
import ItemButton from "@/components/Buttons/ItemButton/ItemButton";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import CalendarModal from "@/components/Modals/CalendarModal/CalendarModal";
import ItemDetailsModal from "@/components/Modals/ItemDetailsModal/ItemDetailsModal";
import TopText from "@/components/TopText/TopText";
import {
  getCategories,
  getEstablishments,
  getProducts,
  getProductsBySubcategory,
  getSmartBills,
  getSmartBillsByEstablishment,
  getSubcategories,
} from "@/services/database/queries";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styleSeeAll";

//Estrutura generica
type BaseItem = {
  id: string | number;
  name: string;
  total_spent: number;
  [key: string]: any;
};

//Tipos de dados
export type DataType =
  | "products"
  | "establishments"
  | "smartbills"
  | "categories"
  | "subcategories"
  | "subcategory-products";

export default function FilterScreen() {
  const [data, setData] = useState<Array<BaseItem>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DataType>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<
    number | null
  >(null);
  const [selectedEstablishmentName, setSelectedEstablishmentName] =
    useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    setDateRange({ startDate: start, endDate: end });
  }, []);

  const getDateRange = () => ({
    firstDay: dateRange.startDate.toISOString().split("T")[0],
    lastDay: dateRange.endDate.toISOString().split("T")[0],
  });

  const { firstDay, lastDay } = getDateRange();

  const options = [
    { label: "Produtos", value: "products" as const },
    { label: "Categorias", value: "categories" as const },
    { label: "Estabelecimentos", value: "establishments" as const },
    { label: "Smartbills", value: "smartbills" as const },
  ];

  // Objeto que mapeia os dados
  type DataMapper<T> = {
    fetchFn: () => Promise<T[]>;
    totalSpent: (item: T) => number;
    name: (item: T) => string;
    id: (item: T) => string | number;
    renderSubtitle?: (item: T) => string;
  };

  // Mapeamento de dados
  const dataMappers: Record<DataType, DataMapper<any>> = {
    products: {
      fetchFn: () => getProducts(firstDay, lastDay),
      totalSpent: (p) => p.unit_price * (p.quantity || 1),
      name: (p) => p.name,
      id: (p) => p.id,
      renderSubtitle: (p) => `${p.category_name} | ${p.subcategory_name}`,
    },
    categories: {
      fetchFn: () => getCategories(firstDay, lastDay),
      totalSpent: (c) => c.total_spent || 0,
      name: (c) => c.name,
      id: (c) => c.id,
      renderSubtitle: (c) => `Subcategorias: ${c.subcategory_count}`,
    },
    subcategories: {
      fetchFn: async () => {
        if (!selectedCategory) return [];
        return getSubcategories(selectedCategory, firstDay, lastDay);
      },
      totalSpent: (s) => s.total_spent || 0,
      name: (s) => s.name,
      id: (s) => s.id,
      renderSubtitle: (s) => `${s.item_count || 0} itens`,
    },
    establishments: {
      fetchFn: () => getEstablishments(firstDay, lastDay),
      totalSpent: (e) => e.total_spent || 0,
      name: (e) => e.name,
      id: (e) => e.id,
      renderSubtitle: (e) => `smartbills: ${e.bill_count}`,
    },
    smartbills: {
      fetchFn: async () => {
        if (selectedEstablishment) {
          return getSmartBillsByEstablishment(
            selectedEstablishment,
            firstDay,
            lastDay
          );
        }
        return getSmartBills(firstDay, lastDay);
      },
      totalSpent: (sb) => sb.amount || 0,
      name: (sb) => sb.establishment_name,
      id: (sb) => sb.id,
      renderSubtitle: (sb) => `${sb.purchase_date} | ${sb.item_count} produtos`,
    },
    "subcategory-products": {
      fetchFn: async () => {
        if (!selectedSubcategory) return [];
        return getProductsBySubcategory(selectedSubcategory, firstDay, lastDay);
      },
      totalSpent: (p) => p.unit_price * (p.quantity || 1),
      name: (p) => p.name,
      id: (p) => p.id,
      renderSubtitle: (p) => `${p.establishment_name}`,
    },
  };

  // Função para buscar dados
  const fetchData = async (type: DataType) => {
    try {
      setLoading(true);
      setError(null);
      const { fetchFn, totalSpent, name, id } = dataMappers[type];
      const items = await fetchFn();

      setData(
        items.map((item: any) => ({
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
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a navegação da pagina
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
    } else if (selectedOption === "categories") {
      setSelectedCategory(item.id);
      setSelectedCategoryName(item.name);
      setSelectedOption("subcategories");
    } else if (selectedOption === "subcategories") {
      setSelectedSubcategory(item.id);
      setSelectedSubcategoryName(item.name);
      setSelectedOption("subcategory-products");
    }
  };

  // Função para lidar com a seleção de uma opção
  const handleOptionSelect = (option: DataType) => {
    setSelectedOption(option);
    setSelectedEstablishment(null);
    setSelectedEstablishmentName("");
    setSelectedCategory(null);
    setSelectedCategoryName("");
    setSelectedSubcategory(null);
    setSelectedSubcategoryName("");

    setShowDropdown(false);
  };

  // useEffect para buscar dados
  useEffect(() => {
    fetchData(selectedOption);
  }, [
    selectedOption,
    selectedEstablishment,
    selectedCategory,
    selectedSubcategory,
    dateRange,
  ]);

  // Função para truncar o nome
  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  };

  // Filtrar os itens
  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para lidar com a seleção de uma data
  const handleDateRangeSelected = (startDate: string, endDate: string) => {
    setDateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View>
          <View>
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
              third={"Smart Bill"}
              clickable={true}
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
              {options.map((option) => (
                <TouchableOpacity
                  style={styles.dropdownOption}
                  key={option.value}
                  onPress={() => handleOptionSelect(option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <DonutGraph
          totalSpent={filteredItems.reduce(
            (sum, item) => sum + (item.total_spent || 0),
            0
          )}
          content={filteredItems
            .filter((item) => item.total_spent > 0)
            .map((item) => ({
              name: item.name,
              total_spent: item.total_spent,
            }))}
          size={250}
        />
        <View style={styles.buttonsContainer}>
          {showSearchInput ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Pesquisar..."
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  setShowSearchInput(false);
                  setSearchQuery("");
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Button
                onPress={() => setShowSearchInput(true)}
                icon={
                  <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color="white"
                  />
                }
                variant="primary"
              />
            </View>
          )}
          <View style={styles.container}>
            <Button
              variant="primary"
              title={
                dateRange.startDate.toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }) +
                " - " +
                dateRange.endDate.toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })
              }
              onPress={() => setShowCalendarModal(true)}
              icon={
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="white"
                />
              }
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.listContent}
        >
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : filteredItems.length === 0 ? (
            <Text style={styles.noItemsText}>Nenhum item encontrado</Text>
          ) : (
            filteredItems.map((item) => (
              <ItemButton
                key={`${item.id}-${item.name}`}
                title={truncateName(item.name)}
                subtitle={
                  dataMappers[selectedOption]?.renderSubtitle?.(item) || ""
                }
                value={`${item.total_spent.toFixed(2)}€`}
                onPress={() => handleItemPress(item)}
              />
            ))
          )}
        </ScrollView>
      </View>
      <CalendarModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onDateRangeSelected={handleDateRangeSelected}
        initialStartDate={dateRange.startDate.toISOString().split("T")[0]}
        initialEndDate={dateRange.endDate.toISOString().split("T")[0]}
      />
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
