import DonutGraph from "@/components/DonutGraph/DonutGraph";
import FilterListItem from "@/components/RenderItem/RenderItem";
import TopText from "@/components/TopText/TopText";
import {
  CategorySpending,
  Establishment,
  getAllCategoriesSpending,
  getAllEstablishments,
  getAllProducts,
  getAllSmartBills,
  getCurrentMonthCategorySpending,
  getCurrentMonthTotalSpent,
  Product,
  SmartBill,
} from "@/services/database/queries";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import styles from "./styleFilterScreen";

const ITEMS_PER_PAGE = 10;

const FilterScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    CategorySpending[]
  >([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<
    Establishment[]
  >([]);
  const [smartbills, setSmartbills] = useState<SmartBill[]>([]);
  const [filteredSmartbills, setFilteredSmartbills] = useState<SmartBill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Produtos");
  const [viewMode, setViewMode] = useState<
    "products" | "categories" | "establishments" | "smartbills"
  >("products");

  const dropdownOptions = [
    { id: "products", label: "Produtos" },
    { id: "categories", label: "Categorias" },
    { id: "establishments", label: "Estabelecimentos" },
    { id: "smartbills", label: "SmartBills" },
  ];

  const handleSelectOption = (option: string, id: string) => {
    setSelectedOption(option);
    setViewMode(id as any);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        productsData,
        total,
        categories,
        allCategories,
        establishmentsData,
        smartbillsData,
      ] = await Promise.all([
        getAllProducts(ITEMS_PER_PAGE, 0),
        getCurrentMonthTotalSpent(),
        getCurrentMonthCategorySpending(),
        getAllCategoriesSpending(),
        getAllEstablishments(),
        getAllSmartBills(),
      ]);

      setProducts(productsData);
      setCategories(allCategories);
      setEstablishments(establishmentsData);
      setSmartbills(smartbillsData);
      setFilteredProducts(productsData);
      setFilteredCategories(allCategories);
      setFilteredEstablishments(establishmentsData);
      setFilteredSmartbills(smartbillsData);
      setTotalSpent(total);
      setCategorySpending(categories);
      setHasMore(productsData.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (viewMode === "products") {
        setFilteredProducts(products);
      } else if (viewMode === "categories") {
        setFilteredCategories(categories);
      } else if (viewMode === "establishments") {
        setFilteredEstablishments(establishments);
      } else if (viewMode === "smartbills") {
        setFilteredSmartbills(smartbills);
      }
    } else {
      const query = searchQuery.toLowerCase();
      if (viewMode === "products") {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.establishment_name.toLowerCase().includes(query) ||
            product.category_name.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
      } else if (viewMode === "categories") {
        const filtered = categories.filter((category) =>
          category.category_name.toLowerCase().includes(query)
        );
        setFilteredCategories(filtered);
      } else if (viewMode === "establishments") {
        const filtered = establishments.filter(
          (establishment) =>
            establishment.name.toLowerCase().includes(query) ||
            (establishment.location &&
              establishment.location.toLowerCase().includes(query))
        );
        setFilteredEstablishments(filtered);
      } else if (viewMode === "smartbills") {
        const filtered = smartbills.filter(
          (bill) =>
            bill.establishment_name.toLowerCase().includes(query) ||
            (bill.establishment_location &&
              bill.establishment_location.toLowerCase().includes(query)) ||
            bill.purchase_date.toLowerCase().includes(query)
        );
        setFilteredSmartbills(filtered);
      }
    }
  }, [searchQuery, products, categories, establishments, smartbills, viewMode]);

  const fetchMoreProducts = useCallback(async (page: number) => {
    try {
      setIsLoadingMore(true);
      const offset = page * ITEMS_PER_PAGE;
      const productsData = await getAllProducts(ITEMS_PER_PAGE, offset);

      setCurrentPage(page);
      setHasMore(productsData.length === ITEMS_PER_PAGE);
      setProducts((prev) => [...prev, ...productsData]);
    } catch (err) {
      console.error("Failed to fetch more products:", err);
      setError("Failed to load more products");
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loadMoreItems = () => {
    if (!isLoading && !isLoadingMore && hasMore && searchQuery === "") {
      fetchMoreProducts(currentPage + 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <FilterListItem viewMode={viewMode} item={item} />
  );

  const data =
    viewMode === "products"
      ? filteredProducts
      : viewMode === "categories"
      ? filteredCategories
      : viewMode === "establishments"
      ? filteredEstablishments
      : filteredSmartbills;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.dropdownContainer}>
          <TopText
            first={selectedOption}
            second="na minha"
            third="Smart Bill"
            clickable={true}
            onFirstPress={() => setShowDropdown(!showDropdown)}
          />

          {showDropdown && (
            <View style={styles.dropdown}>
              {dropdownOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectOption(option.label, option.id)}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.chartContainer}>
        <DonutGraph
          totalSpent={totalSpent}
          content={categorySpending}
          size={250}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Pesquisar ${selectedOption.toLowerCase()}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            viewMode === "products"
              ? `product-${(item as Product).id}`
              : viewMode === "categories"
              ? `category-${(item as CategorySpending).category_name}`
              : viewMode === "establishments"
              ? `establishment-${(item as Establishment).id}`
              : `smartbill-${(item as SmartBill).id}`
          }
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

export default FilterScreen;
