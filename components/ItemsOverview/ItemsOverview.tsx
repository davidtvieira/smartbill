import Button from "@/components/Buttons/Button/Button";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import SearchInput from "@/components/SearchInput/SearchInput";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ItemButton from "../Buttons/ItemButton/ItemButton";
import styles from "./styleItemsOverview";

type BaseItem = {
  id: string | number;
  name: string;
  total_spent: number;
  category_name?: string;
  quantity?: number;
  unit_price?: number;
  [key: string]: any;
};

type DataType =
  | "products"
  | "establishments"
  | "smartbills"
  | "categories"
  | "subcategories"
  | "subcategory-products";

type ItemsOverviewProps<T extends BaseItem> = {
  items: T[];
  onItemPress: (item: T) => void;
  showButtons?: boolean;
  showSearch?: boolean;
  title?: string;
  showGraph?: boolean;
  dataType?: DataType;
  renderTitle?: (item: T) => string;
  renderSubtitle?: (item: T) => string | undefined;
  renderValue?: (item: T) => string;
  loading?: boolean;
  error?: string | null;
};

const ItemsOverview = <T extends BaseItem>({
  items,
  onItemPress,
  showButtons = true,
  showSearch = false,
  showGraph = true,
  renderTitle,
  renderSubtitle,
  renderValue,
  loading = false,
  error = null,
}: ItemsOverviewProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemPress = (item: T) => {
    onItemPress(item);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showGraph && items.length > 0 && (
        <DonutGraph
          totalSpent={items.reduce((acc, curr) => acc + curr.total_spent, 0)}
          content={items.map((item) => ({
            name: item.name,
            total_spent: item.total_spent,
          }))}
          size={250}
        />
      )}
      {showSearch && (
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Pesquisar..."
        />
      )}
      {showButtons && (
        <View>
          <Button
            title="Smart Bill"
            onPress={() => navigation.navigate("AddSmartBill" as never)}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {filteredItems.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Ultimos 7 dias
                </Text>
                <Button
                  title="Ver Todos"
                  onPress={() => navigation.navigate("FilterScreen" as never)}
                  variant="onlyText"
                />
              </View>
            )}
          </View>
        </View>
      )}
      <ScrollView>
        {filteredItems.map((item) => (
          <ItemButton
            key={`${item.id}-${item.name}`}
            title={renderTitle ? renderTitle(item) : item.name}
            subtitle={renderSubtitle?.(item)}
            value={
              renderValue
                ? renderValue(item)
                : `€${item.total_spent.toFixed(2)}`
            }
            onPress={() => handleItemPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ItemsOverview;
