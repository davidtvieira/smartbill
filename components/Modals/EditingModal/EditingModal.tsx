import { SmartBillData } from "@/app/screens/SettingUpSmartBill/SettingUpSmartBill";
import Button from "@/components/Buttons/Button/Button";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import styles from "./styleEditingModal";

import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  category: string;
  sub_category: string;
}

const EditingModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  editingField: string | null;
  isItemEditing: boolean;
  editedData: SmartBillData | null;
  onFieldChange: (field: keyof SmartBillData, value: string) => void;
  onItemEdit: (index: number, field: keyof ReceiptItem, value: string) => void;
  onItemEditFinish: () => void;
}> = ({
  visible,
  onClose,
  editingField,
  isItemEditing,
  editedData,
  onFieldChange,
  onItemEdit,
  onItemEditFinish,
}) => {
  const [tempValue, setTempValue] = useState<string>(
    editedData?.[editingField as keyof SmartBillData]?.toString() || ""
  );
  const [tempItem, setTempItem] = useState<ReceiptItem>({
    name: "",
    quantity: 0,
    unit_price: 0,
    category: "",
    sub_category: "",
  });
  const [quantityInput, setQuantityInput] = useState("");
  const [unitPriceInput, setUnitPriceInput] = useState("");

  const itemIndex = editingField?.startsWith("item")
    ? parseInt(editingField.split("-")[1])
    : null;

  useEffect(() => {
    if (!visible) {
      setQuantityInput("");
      setUnitPriceInput("");
      setTempValue("");
      setTempItem({
        name: "",
        quantity: 0,
        unit_price: 0,
        category: "",
        sub_category: "",
      });
      return;
    }

    if (!editedData) return;

    if (isItemEditing && itemIndex !== null) {
      const item = editedData?.items?.[itemIndex];
      if (item) {
        setTempItem(item);
        setQuantityInput(item.quantity?.toString() || "");
        setUnitPriceInput(item.unit_price?.toString() || "");
      }
    } else if (editingField && !isItemEditing) {
      const value = editedData?.[editingField as keyof SmartBillData];
      setTempValue(typeof value === "string" ? value : String(value || ""));
    }
  }, [visible, editingField, isItemEditing, itemIndex, editedData]);

  const formatDate = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    let formatted = numbers.slice(0, 2);
    if (numbers.length > 2) {
      formatted += "-" + numbers.slice(2, 4);
    }
    if (numbers.length > 4) {
      formatted += "-" + numbers.slice(4, 8);
    }
    return formatted;
  };

  const formatTime = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    let formatted = numbers.slice(0, 2);
    if (numbers.length > 2) {
      formatted += ":" + numbers.slice(2, 4);
    }
    return formatted;
  };

  const handleInputChange = (text: string, field: string) => {
    if (field === "date") {
      setTempValue(formatDate(text));
    } else if (field === "time") {
      setTempValue(formatTime(text));
    } else {
      setTempValue(text);
    }
  };

  const handleClose = () => {
    setQuantityInput("");
    setUnitPriceInput("");
    setTempValue("");
    setTempItem({
      name: "",
      quantity: 1,
      unit_price: 0,
      category: "",
      sub_category: "",
    });
    Keyboard.dismiss();
    onClose();
    onItemEditFinish();
  };

  const handleUpdate = () => {
    if (editingField === "date" && tempValue) {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(tempValue)) {
        Alert.alert(
          "Formato inválido",
          "Por favor, insira a data no formato DD-MM-AAAA"
        );
        return;
      }
    }

    if (editingField === "time" && tempValue) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(tempValue)) {
        Alert.alert(
          "Formato inválido",
          "Por favor, insira a hora no formato HH:MM"
        );
        return;
      }
    }

    if (isItemEditing && itemIndex !== null) {
      onItemEdit(itemIndex, "name", tempItem.name);
      onItemEdit(itemIndex, "quantity", quantityInput);
      onItemEdit(itemIndex, "unit_price", unitPriceInput);
      onItemEdit(itemIndex, "category", tempItem.category);
      onItemEdit(itemIndex, "sub_category", tempItem.sub_category);
      onItemEditFinish();
    } else if (editingField) {
      onFieldChange(editingField as keyof SmartBillData, tempValue);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.container}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.modal}>
            {!isItemEditing && editingField && (
              <>
                <Text style={styles.label}>
                  {editingField === "local" && "Local"}
                  {editingField === "establishment" && "Estabelecimento"}
                  {editingField === "date" && "Data"}
                  {editingField === "time" && "Hora"}
                </Text>
                <TextInput
                  value={tempValue}
                  onChangeText={(text) => handleInputChange(text, editingField)}
                  placeholder={
                    editingField === "local"
                      ? "Ex: Continente de Lisboa"
                      : editingField === "establishment"
                      ? "Ex: Continente"
                      : editingField === "date"
                      ? "DD-MM-AAAA"
                      : "HH:MM"
                  }
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                  keyboardType={
                    editingField === "date" || editingField === "time"
                      ? "numeric"
                      : "default"
                  }
                  maxLength={
                    editingField === "date"
                      ? 10
                      : editingField === "time"
                      ? 5
                      : undefined
                  }
                />
              </>
            )}

            {isItemEditing && itemIndex !== null && (
              <>
                <Text style={styles.label}>Nome do Produto</Text>
                <TextInput
                  value={tempItem.name}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Nome do Produto"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                />

                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                  value={quantityInput}
                  onChangeText={(text) => {
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setQuantityInput(text);
                    }
                  }}
                  placeholder="Quantidade"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <Text style={styles.label}>Preço Unitário</Text>
                <TextInput
                  value={unitPriceInput}
                  onChangeText={(text) => {
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setUnitPriceInput(text);
                    }
                  }}
                  placeholder="Preço Unitário"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />

                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  value={tempItem.category}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({ ...prev, category: text }))
                  }
                  placeholder="Categoria"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                />

                <Text style={styles.label}>Subcategoria</Text>
                <TextInput
                  value={tempItem.sub_category}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({ ...prev, sub_category: text }))
                  }
                  placeholder="Subcategoria"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                />
              </>
            )}

            <Button
              title="Atualizar"
              variant="primary"
              onPress={handleUpdate}
            />
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditingModal;
