import Button from "@/components/Buttons/Button/Button";
import DonutGraph from "@/components/DonutGraph/DonutGraph";
import { useNavigation } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import styles from "./styleItemsOverview";

type BaseItem = {
  id: string | number;
  name: string;
  [key: string]: any;
};

type ItemSpending = {
  name: string;
  total: number;
};

type ItemsOverviewProps<T extends BaseItem> = {
  items: T[];
  onItemPress: (item: T) => void;
  showButtons?: boolean;
  title?: string;
  showGraph?: boolean;
  getItemValue?: (item: T) => number;
  renderItemContent?: (item: T) => React.ReactNode;
};

const defaultGetItemValue = (item: any) => {
  return item.unit_price * (item.quantity || 1);
};

const defaultRenderItemContent = (item: any) => (
  <Text>{`${item.name} - €${defaultGetItemValue(item).toFixed(2)}`}</Text>
);

const ItemsOverview = <T extends BaseItem>({
  items,
  onItemPress,
  showButtons = true,
  showGraph = true,
  getItemValue = defaultGetItemValue,
  renderItemContent = defaultRenderItemContent,
}: ItemsOverviewProps<T>) => {
  const navigation = useNavigation() as any;

  const itemSpending = items.reduce<ItemSpending[]>((acc, item) => {
    const itemTotal =
      "total_spent" in item
        ? item.total_spent
        : "value" in item
        ? item.value
        : 0;
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
          <>
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
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                Categorias
              </Text>
              <Button
                title="Ver Todos"
                onPress={() => navigation.navigate("FilterScreen" as never)}
                variant="onlyText"
              />
            </View>
          </>
        )}
        <ScrollView contentContainerStyle={styles.listContent}>
          {items.map((item) => (
            <View key={item.id.toString()}>
              <Button
                title={renderItemContent(item) as string}
                onPress={() => onItemPress(item)}
                variant="secondary"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ItemsOverview;
