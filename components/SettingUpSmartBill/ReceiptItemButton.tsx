import Button from "@/components/buttons/Button";
import React from "react";

interface ReceiptItem {
  titulo: string;
  quantidade: number;
  preco_unitario: number;
}

interface Props {
  item: ReceiptItem;
  onPress: () => void;
}

export default function ReceiptItemButton({ item, onPress }: Props) {
  return (
    <Button
      title={`${item.titulo} - Qtd: ${
        item.quantidade
      } - €${item.preco_unitario.toFixed(2)}`}
      variant="secondary"
      onPress={onPress}
    />
  );
}
