import { SmartBillData } from "@/app/screens/SettingUpSmartBill/SettingUpSmartBill";
import Button from "@/components/Buttons/Button/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
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
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  // Função para definir o estado do modal
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

    // Função para definir o estado do item
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

  // Função para lidar com a seleção de uma data
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      if (editingField === "date") {
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const year = selectedDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setTempValue(formattedDate);
      } else if (editingField === "time") {
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        setTempValue(formattedTime);
      }
    }
  };

  // Função para mostrar o picker de data e hora
  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  // Função para renderizar o picker de data e hora
  const renderDateTimePicker = () => {
    if (!showPicker) return null;

    return (
      <DateTimePicker
        value={selectedDate}
        mode={editingField === "date" ? "date" : "time"}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={handleDateChange}
        style={styles.dateTimePicker}
      />
    );
  };

  // Função para formatar a data
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

  // Função para formatar a hora
  const formatTime = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    let formatted = numbers.slice(0, 2);
    if (numbers.length > 2) {
      formatted += ":" + numbers.slice(2, 4);
    }
    return formatted;
  };

  // Função para lidar com a alteração do input
  const handleInputChange = (text: string, field: string) => {
    if (field === "date") {
      setTempValue(formatDate(text));
    } else if (field === "time") {
      setTempValue(formatTime(text));
    } else {
      setTempValue(text);
    }
  };

  // Função para fechar o modal
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

  // Função para atualizar o modal
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

    // Função para lidar com a alteração do input
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

    // Função para lidar com a alteração do input
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
                {/* Label */}
                <Text style={styles.label}>
                  {editingField === "local" && "Local"}
                  {editingField === "establishment" && "Estabelecimento"}
                  {editingField === "date" && "Data"}
                  {editingField === "time" && "Hora"}
                </Text>
                {editingField === "date" || editingField === "time" ? (
                  <>
                    <Pressable
                      onPress={showDateTimePicker}
                      style={styles.dateTimeInput}
                    >
                      <Text style={styles.dateTimeText}>
                        {tempValue ||
                          (editingField === "date"
                            ? "Selecione a data"
                            : "Selecione a hora")}
                      </Text>
                    </Pressable>
                    {renderDateTimePicker()}
                  </>
                ) : (
                  <TextInput
                    value={tempValue}
                    onChangeText={(text) =>
                      handleInputChange(text, editingField)
                    }
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
                )}
              </>
            )}
            {/* Item Editing */}
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
