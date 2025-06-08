import Button from "@/components/Buttons/Button/Button";
import {
  deleteSmartBill,
  getProductsBySmartBill,
} from "@/services/database/queries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import styles from "./styleItemDetailsModal";

interface ItemDetailsModalProps {
  visible: boolean;
  selectedItem: any | null;
  selectedOption: string;
  onClose: () => void;
  onDelete?: () => void;
}

interface Product {
  name: string;
  quantity: number;
  unit_price: number;
  category_name: string;
  subcategory_name: string;
}

export default function ItemDetailsModal({
  visible,
  selectedItem,
  selectedOption,
  onClose,
  onDelete,
}: ItemDetailsModalProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  React.useEffect(() => {
    if (selectedOption === "smartbills" && selectedItem?.id) {
      getProductsBySmartBill(selectedItem.id).then((products) => {
        setProducts(
          products.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            unit_price: product.unit_price,
            category_name: product.category_name,
            subcategory_name: product.subcategory_name || "",
          }))
        );
      });
    } else {
      setProducts([]);
    }
  }, [selectedOption, selectedItem?.id]);

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selectedItem?.id) {
      try {
        await deleteSmartBill(selectedItem.id);
        setShowDeleteConfirmation(false);
        onClose();
        Alert.alert("Sucesso", "A fatura foi apagada com sucesso!", [
          { text: "OK", onPress: () => onDelete?.() },
        ]);
      } catch (error) {
        console.error("Error deleting bill:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao apagar a fatura. Por favor, tente novamente.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {(selectedOption === "products" ||
            selectedOption === "subcategory-products") &&
            selectedItem && (
              <View>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                {selectedItem.establishment_name && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Estabelecimento:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.establishment_name}
                    </Text>
                  </View>
                )}
                {selectedItem.category_name && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Categoria:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.category_name}
                    </Text>
                  </View>
                )}

                {selectedItem.subcategory_name && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Subcategoria:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.subcategory_name || "Sem subcategoria"}
                    </Text>
                  </View>
                )}
                {selectedItem.unit_price && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Preço Unitário:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.unit_price}€
                    </Text>
                  </View>
                )}
                {selectedItem.establishment_location && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Localização:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.establishment_location}
                    </Text>
                  </View>
                )}
                {selectedItem.purchase_date && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Data:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.purchase_date}
                    </Text>
                  </View>
                )}
                {selectedItem.purchase_time && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Hora:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.purchase_time}
                    </Text>
                  </View>
                )}
              </View>
            )}

          {selectedOption === "smartbills" && selectedItem && (
            <ScrollView>
              <View>
                <View>
                  <View style={styles.container}>
                    <Text style={styles.modalTitle}>
                      {selectedItem.name} -{" "}
                      {selectedItem.establishment_location}
                    </Text>
                  </View>
                  <Text style={styles.modalText}>
                    Data: {selectedItem.purchase_date}
                  </Text>
                  <Text style={styles.modalText}>
                    Hora: {selectedItem.purchase_time}
                  </Text>
                </View>

                <Text style={styles.modalText}>
                  Produtos: {selectedItem.item_count}
                </Text>
                <Text style={styles.modalText}>
                  Total: {selectedItem.amount}€
                </Text>
              </View>

              {products.map((product, index) => (
                <View key={index}>
                  {index > 0 && <View style={styles.divider} />}
                  <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                    {product.name}
                  </Text>
                  <Text style={styles.modalText}>
                    {product.category_name} - {product.subcategory_name}
                  </Text>

                  <Text style={styles.modalText}>
                    {product.quantity} x {product.unit_price}€
                  </Text>

                  <Text style={styles.modalText}>
                    Total: {product.quantity * product.unit_price}€
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.buttonContainer}>
            {selectedOption === "smartbills" && (
              <Button
                onPress={handleDelete}
                icon={<MaterialIcons name="delete" size={20} color="white" />}
                variant="danger"
                title="Apagar"
              />
            )}
            <Button onPress={onClose} variant="secondary" title="Fechar" />
          </View>

          {showDeleteConfirmation && (
            <View style={styles.overlay}>
              <View style={styles.dialog}>
                <View style={styles.dialogTitle}>
                  <MaterialIcons name="warning" size={20} color="white" />
                  <Text style={styles.title}>Confirmar Exclusão</Text>
                </View>
                <Text style={styles.text}>
                  Tens a certeza que deseja apagar esta fatura? Esta ação não
                  pode ser desfeita.
                </Text>
                <View style={styles.buttonContainer}>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={confirmDelete}
                      icon={
                        <MaterialIcons name="delete" size={20} color="white" />
                      }
                      variant="danger"
                      title="Sim"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={cancelDelete}
                      variant="secondary"
                      title="Cancelar"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
