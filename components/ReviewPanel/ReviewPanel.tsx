import { SmartBillData } from "@/app/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill";
import Button from "@/components/Buttons/Button/Button";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  data: SmartBillData;
  onFieldEdit: (field: keyof SmartBillData) => void;
  onItemEditStart: (index: number) => void;
}

export default function ReviewPanel({
  data,
  onFieldEdit,
  onItemEditStart,
}: Props) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Informação Geral
      </Text>
      <Button
        title={data.local || "Local"}
        variant="secondary"
        onPress={() => onFieldEdit("local")}
      />
      <Button
        title={data.establishment || "Estabelecimento"}
        variant="secondary"
        onPress={() => onFieldEdit("establishment")}
      />
      <Button
        title={data.date || "Data (DD-MM-AAAA)"}
        variant="secondary"
        onPress={() => onFieldEdit("date")}
      />
      <Button
        title={data.time || "Hora (HH:MM)"}
        variant="secondary"
        onPress={() => onFieldEdit("time")}
      />

      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Produtos
      </Text>
      {data.items?.map((item, index) => (
        <Button
          key={index}
          title={`${item.name} | Qtd: ${
            item.quantity
          } | €${item.unit_price.toFixed(2)}`}
          variant="secondary"
          onPress={() => onItemEditStart(index)}
        />
      ))}
    </View>
  );
}
