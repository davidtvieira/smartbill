import Button from "@/components/buttons/Button";
import React from "react";

interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
}

interface Props {
  item: ReceiptItem;
  onPress: () => void;
  maxNameLength?: number;
}

export default function DataButton({
  item,
  onPress,
  maxNameLength = 12,
}: Props) {
  const truncatedName =
    item.name.length > maxNameLength
      ? item.name.substring(0, maxNameLength) + "..."
      : item.name;

  return (
    <Button
      title={`${truncatedName} | Qtd: ${
        item.quantity
      } | €${item.unit_price.toFixed(2)}`}
      variant="secondary"
      onPress={onPress}
    />
  );
}
