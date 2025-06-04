import Button from "@/components/Buttons/Button/Button";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import SearchInput from "@/components/SearchInput/SearchInput";
import {
  getAllCategories,
  getAllEstablishments,
  getAllProducts,
  getAllSmartBills,
} from "@/services/database/queries";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ItemButton from "../Buttons/ItemButton/ItemButton";
import styles from "./styleItemsOverview";

const MAX_ITEM_NAME_LENGTH = 25;
const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
};

type BaseItem = {
  id: string | number;
  name: string;
  total_spent: number;
  category_name?: string;
  quantity?: number;
  unit_price?: number;
  [key: string]: any;
};

type ItemSpending = {
  name: string;
  total: number;
};

type DataType = "products" | "establishments" | "smartbills" | "categories";

type DataMapper<T> = {
  fetchFn: () => Promise<T[]>;
  totalSpent: (item: T) => number;
  name: (item: T) => string;
  id: (item: T) => string | number;
  renderSubtitle?: (item: T) => string;
};

const dataMappers: Record<DataType, DataMapper<any>> = {
  products: {
    fetchFn: getAllProducts,
    totalSpent: (p) => p.unit_price * (p.quantity || 1),
    name: (p) => p.name,
    id: (p) => p.id,
    renderSubtitle: (p) => `${p.category_name}`,
  },
  categories: {
    fetchFn: getAllCategories,
    totalSpent: (c) => c.total_spent || 0,
    name: (c) => c.name,
    id: (c) => c.id,
    renderSubtitle: (c) =>
      c.subcategory_count
        ? `${c.subcategory_count} subcategoria${
            c.subcategory_count !== 1 ? "s" : ""
          }`
        : "Sem subcategorias",
  },
  establishments: {
    fetchFn: getAllEstablishments,
    totalSpent: (e) => e.total_spent || 0,
    name: (e) => e.name,
    id: (e) => e.id,
    renderSubtitle: (e) => `${e.bill_count} smartbill`,
  },
  smartbills: {
    fetchFn: getAllSmartBills,
    totalSpent: (sb) => sb.total_amount || 0,
    name: (sb) => sb.establishment_name,
    id: (sb) => sb.id,
    renderSubtitle: (sb) => `${sb.item_count} produtos | ${sb.purchase_date}`,
  },
};

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
};

const ItemsOverview = <T extends BaseItem>({
  items,
  onItemPress,
  showButtons = true,
  showSearch = false,
  showGraph = true,
  dataType,
  renderTitle = (item) => truncateString(item.name, MAX_ITEM_NAME_LENGTH),
  renderSubtitle = (item) => {
    if (dataType && dataMappers[dataType].renderSubtitle) {
      return dataMappers[dataType].renderSubtitle(item);
    }
    return item.category_name;
  },
  renderValue = (item) => `${item.total_spent.toFixed(2)}€`,
}: ItemsOverviewProps<T>) => {
  const navigation = useNavigation() as any;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = showSearch
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const itemSpending = filteredItems.reduce<ItemSpending[]>((acc, item) => {
    const itemTotal = "total_spent" in item ? item.total_spent : 0;
    const existingItem = acc.find((i) => i.name === item.name);

    if (existingItem) {
      existingItem.total += itemTotal;
    } else {
      acc.push({
        name: item.name,
        total: itemTotal,
      });
    }
    return acc;
  }, []);

  const totalSpent = itemSpending.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <View style={styles.container}>
      {showGraph && itemSpending.length > 0 && (
        <DonutGraph
          totalSpent={totalSpent}
          content={itemSpending.map((item) => ({
            name: item.name,
            total_spent: item.total,
          }))}
          size={250}
        />
      )}

      <View style={styles.listContainer}>
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
        {showSearch && (
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar..."
          />
        )}

        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredItems.map((item) => (
            <View key={item.id.toString()}>
              <ItemButton
                title={renderTitle(item)}
                value={renderValue(item)}
                subtitle={renderSubtitle(item)}
                onPress={() => onItemPress(item)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ItemsOverview;
