import { SmartBillData } from "@/app/screens/SettingUpSmartBill/SettingUpSmartBill";
import ItemButton from "@/components/Buttons/ItemButton/ItemButton";
import React from "react";
import { Text, View } from "react-native";
import styles from "./styleReviewPanel";

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
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Informação Geral</Text>
        <ItemButton
          title={"Local"}
          value={
            data.local.length > 8
              ? data.local.substring(0, 8) + "..."
              : data.local
          }
          onPress={() => onFieldEdit("local")}
        />
        <ItemButton
          title={"Estabelecimento"}
          value={
            data.establishment.length > 8
              ? data.establishment.substring(0, 8) + "..."
              : data.establishment
          }
          onPress={() => onFieldEdit("establishment")}
        />
        <ItemButton
          title={"Data"}
          value={data.date}
          onPress={() => onFieldEdit("date")}
        />
        <ItemButton
          title={"Hora"}
          value={data.time}
          onPress={() => onFieldEdit("time")}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Produtos</Text>
        {data.items?.map((item, index) => (
          <ItemButton
            key={index}
            title={`${
              item.name.length > 20
                ? item.name.substring(0, 17) + "..."
                : item.name
            }`}
            subtitle={`Qtd: ${item.quantity}`}
            value={item.unit_price.toString() + "€"}
            onPress={() => onItemEditStart(index)}
          />
        ))}
      </View>
    </View>
  );
}
