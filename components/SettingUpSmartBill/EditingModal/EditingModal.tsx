import { SmartBillData } from "@/app/screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill";
import Button from "@/components/Buttons/Button";
import React, { useEffect, useState } from "react";
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
  const [tempValue, setTempValue] = useState<string>("");
  const [tempItem, setTempItem] = useState<ReceiptItem>({
    name: "",
    quantity: 0,
    unit_price: 0,
    category: "",
    sub_category: "",
  });

  const itemIndex = editingField?.startsWith("item")
    ? parseInt(editingField.split("-")[1])
    : null;

  useEffect(() => {
    if (!visible) {
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
      const item = editedData.items?.[itemIndex];
      setTempItem(
        item || {
          name: "",
          quantity: 0,
          unit_price: 0,
          category: "",
          sub_category: "",
        }
      );
    } else if (editingField && !isItemEditing) {
      const value = editedData[editingField as keyof SmartBillData];
      setTempValue(typeof value === "string" ? value : String(value || ""));
    }
  }, [visible, editingField, isItemEditing, itemIndex, editedData]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
    onItemEditFinish();
  };

  const handleUpdate = () => {
    if (isItemEditing && itemIndex !== null) {
      onItemEdit(itemIndex, "name", tempItem.name);
      onItemEdit(itemIndex, "quantity", String(tempItem.quantity));
      onItemEdit(itemIndex, "unit_price", String(tempItem.unit_price));
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "#273C47",
              borderRadius: 12,
            }}
          >
            {!isItemEditing && editingField && (
              <>
                <Text style={styles.label}>{editingField}</Text>
                <TextInput
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder={editingField}
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
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
                  value={String(tempItem.quantity)}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({
                      ...prev,
                      quantity: parseInt(text) || 0,
                    }))
                  }
                  placeholder="Quantidade"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Preço Unitário</Text>
                <TextInput
                  value={String(tempItem.unit_price)}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({
                      ...prev,
                      unit_price: parseFloat(text) || 0,
                    }))
                  }
                  placeholder="Preço Unitário"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="numeric"
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
