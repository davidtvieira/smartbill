import { SmartBillData } from "@/components/API/api_call";
import Button from "@/components/buttons/Button";
import React from "react";
import { TextInput, View } from "react-native";
import ReceiptItemButton from "./ReceiptItemButton";

interface Props {
  data: SmartBillData;
  onFieldEdit: (field: keyof SmartBillData) => void;
  onItemEditStart: (index: number) => void;
}

export default function ReceiptForm({
  data,
  onFieldEdit,
  onItemEditStart,
}: Props) {
  return (
    <View style={{ gap: 10 }}>
      <TextInput
        value={"Informação Geral"}
        style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
        editable={false}
      />
      <Button
        title={data.local || "Local"}
        variant="secondary"
        onPress={() => onFieldEdit("local")}
      />
      <Button
        title={data.estabelecimento || "Estabelecimento"}
        variant="secondary"
        onPress={() => onFieldEdit("estabelecimento")}
      />
      <Button
        title={data.data || "Data (DD-MM-AAAA)"}
        variant="secondary"
        onPress={() => onFieldEdit("data")}
      />
      <Button
        title={data.hora || "Hora (HH:MM)"}
        variant="secondary"
        onPress={() => onFieldEdit("hora")}
      />

      <TextInput
        value={"Produtos"}
        style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
        editable={false}
      />
      {data.items?.map((item, index) => (
        <ReceiptItemButton
          key={index}
          item={item}
          onPress={() => onItemEditStart(index)}
        />
      ))}
    </View>
  );
}
