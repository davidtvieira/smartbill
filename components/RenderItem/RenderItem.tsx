// components/FilterListItem/FilterListItem.tsx

import Button from "@/components/Buttons/Button/Button";
import {
  CategorySpending,
  Establishment,
  Product,
  SmartBill,
} from "@/services/database/queries";
import { View } from "react-native";
import styles from "./styleRenderItem";

type FilterListItemProps =
  | { viewMode: "products"; item: Product }
  | { viewMode: "categories"; item: CategorySpending }
  | { viewMode: "establishments"; item: Establishment }
  | { viewMode: "smartbills"; item: SmartBill };

const FilterListItem = ({ viewMode, item }: FilterListItemProps) => {
  if (viewMode === "products") {
    const product = item as Product;
    return (
      <View style={styles.itemContainer}>
        <Button
          title={`${product.name} - Qnt: ${product.quantity}`}
          variant="secondary"
          onPress={() => console.log(product)}
        />
      </View>
    );
  }

  if (viewMode === "categories") {
    const category = item as CategorySpending;
    return (
      <View style={styles.itemContainer}>
        <Button
          title={`${category.category_name} - ${category.total_spent.toFixed(
            2
          )}€`}
          variant="secondary"
          onPress={() => console.log(category)}
        />
      </View>
    );
  }

  if (viewMode === "establishments") {
    const establishment = item as Establishment;
    return (
      <View style={styles.itemContainer}>
        <Button
          title={`${establishment.name} - ${establishment.location} - ${
            establishment.purchase_count
          } compras - ${establishment.total_spent.toFixed(2)}€`}
          variant="secondary"
          onPress={() => console.log(establishment)}
        />
      </View>
    );
  }

  if (viewMode === "smartbills") {
    const bill = item as SmartBill;
    return (
      <View style={styles.itemContainer}>
        <Button
          title={`${bill.establishment_name} - ${
            bill.purchase_date
          } - ${bill.total_amount.toFixed(2)}€`}
          variant="secondary"
          onPress={() => console.log(bill)}
        />
      </View>
    );
  }

  return null;
};

export default FilterListItem;
