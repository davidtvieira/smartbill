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
  headerText?: string;
  seeAllText?: string;
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
  headerText,
  seeAllText,
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

  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
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
      {showGraph && (
        <DonutGraph
          totalSpent={filteredItems.reduce(
            (acc, curr) => acc + curr.total_spent,
            0
          )}
          content={filteredItems.map((item) => ({
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

      <View>
        {showButtons && (
          <View>
            <Button
              title="Smart Bill"
              onPress={() => navigation.navigate("AddSmartBill" as never)}
              variant="primary"
            />

            <View style={styles.rowButtons}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Receitas"
                  onPress={() => console.log("Receitas clicked")}
                  variant="secondary"
                  disabled
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="Dividir Despesas"
                  onPress={() => console.log("Dividir Despesas clicked")}
                  variant="secondary"
                  disabled
                />
              </View>
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingTop: 16,
          }}
        >
          {headerText && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {headerText}
            </Text>
          )}
          {seeAllText && (
            <Button
              title={seeAllText}
              onPress={() => navigation.navigate("FilterScreen" as never)}
              variant="onlyText"
            />
          )}
        </View>
      </View>

      <ScrollView>
        {filteredItems.map((item) => (
          <ItemButton
            key={`${item.id}-${item.name}`}
            title={truncateName(renderTitle ? renderTitle(item) : item.name)}
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
