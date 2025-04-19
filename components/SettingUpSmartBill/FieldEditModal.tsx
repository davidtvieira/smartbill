import { SmartBillData } from "@/components/API/api_call";
import Button from "@/components/buttons/Button";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ReceiptItem {
  titulo: string;
  quantidade: number;
  preco_unitario: number;
}

const FieldEditModal: React.FC<{
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
  const [tempItem, setTempItem] = useState({
    titulo: "",
    quantidade: 0,
    preco_unitario: 0,
  });

  const itemIndex = editingField?.startsWith("item")
    ? parseInt(editingField.split("-")[1])
    : null;

  useEffect(() => {
    if (!visible) {
      setTempValue("");
      setTempItem({
        titulo: "",
        quantidade: 0,
        preco_unitario: 0,
      });
      return;
    }

    if (!editedData) return;

    if (isItemEditing && itemIndex !== null) {
      const item = editedData.items?.[itemIndex];
      setTempItem(
        item || {
          titulo: "",
          quantidade: 0,
          preco_unitario: 0,
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
      onItemEdit(itemIndex, "titulo", tempItem.titulo);
      onItemEdit(itemIndex, "quantidade", String(tempItem.quantidade));
      onItemEdit(itemIndex, "preco_unitario", String(tempItem.preco_unitario));
      onItemEditFinish();
    } else if (editingField) {
      onFieldChange(editingField as keyof SmartBillData, tempValue);
    }
    onClose();
  };

  const inputStyle = {
    color: "white",
    backgroundColor: "#2C4450",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
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
              <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                placeholder={editingField}
                style={inputStyle}
              />
            )}

            {isItemEditing && itemIndex !== null && (
              <>
                <TextInput
                  value={tempItem.titulo}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({ ...prev, titulo: text }))
                  }
                  placeholder="Título do Produto"
                  style={inputStyle}
                />
                <TextInput
                  value={String(tempItem.quantidade)}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({
                      ...prev,
                      quantidade: parseInt(text) || 0,
                    }))
                  }
                  placeholder="Quantidade"
                  keyboardType="numeric"
                  style={inputStyle}
                />
                <TextInput
                  value={String(tempItem.preco_unitario)}
                  onChangeText={(text) =>
                    setTempItem((prev) => ({
                      ...prev,
                      preco_unitario: parseFloat(text) || 0,
                    }))
                  }
                  placeholder="Preço Unitário"
                  keyboardType="numeric"
                  style={inputStyle}
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

export default FieldEditModal;
