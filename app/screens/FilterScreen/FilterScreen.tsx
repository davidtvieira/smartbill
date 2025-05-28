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
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "./styleFilterScreen";

const ITEMS_PER_PAGE = 5;

const FilterScreen = () => {
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResult[]>([]);
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

  const dropdownOptions = [
    { id: "products", label: "Produtos" },
    { id: "categories", label: "Categorias" },
    { id: "establishments", label: "Estabelecimentos" },
    { id: "smartbills", label: "Smartbills" },
  ];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsData, total, categories] = await Promise.all([
        getAllProducts(ITEMS_PER_PAGE, 0),
        getCurrentMonthTotalSpent(),
        getCurrentMonthCategorySpending(),
      ]);

      setProducts(productsData);
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
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.establishment_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

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

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderProductItem = ({ item }: { item: ProductResult }) => (
    <View style={styles.itemContainer}>
      <Button
        title={`${item.name} - €${item.unit_price.toFixed(2)}`}
        onPress={() => {
          console.log("Product pressed:", item.id);
        }}
        variant="secondary"
      />
    </View>
  );

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.container}>
        <TopText first="A carregar" second="produtos..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <TopText first="Erro" second={error} />
      </View>
    );
  }

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
                  onPress={() => handleSelectOption(option.label)}
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
          placeholder="Pesquisar produtos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={searchQuery ? filteredProducts : products}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          onEndReached={searchQuery ? null : loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  );
};

export default FilterScreen;
