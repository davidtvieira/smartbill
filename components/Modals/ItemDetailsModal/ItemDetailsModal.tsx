import Button from "@/components/Buttons/Button/Button";
import {
  deleteSmartBill,
  getProductsBySmartBill,
} from "@/services/database/queries";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import styles from "./styleItemDetailsModal";

interface ItemDetailsModalProps {
  visible: boolean;
  selectedItem: any | null;
  selectedOption: string;
  onClose: () => void;
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

  const confirmDelete = () => {
    if (selectedItem?.id) {
      try {
        deleteSmartBill(selectedItem.id);
        setShowDeleteConfirmation(false);
        onClose();
        Alert.alert("Sucesso", "A fatura foi apagada com sucesso!", [
          { text: "OK" },
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
                <Text style={styles.modalText}>
                  {selectedItem.category_name} -{" "}
                  {selectedItem.subcategory_name || "Sem subcategoria"}
                </Text>
                <Text style={styles.modalText}>
                  Preço Unitário: {selectedItem.unit_price}€
                </Text>
                {selectedItem.establishment_name && (
                  <Text style={styles.modalText}>
                    Estabelecimento: {selectedItem.establishment_name}
                  </Text>
                )}
                {selectedItem.establishment_location && (
                  <Text style={styles.modalText}>
                    Localização: {selectedItem.establishment_location}
                  </Text>
                )}
                {selectedItem.purchase_date && (
                  <Text style={styles.modalText}>
                    Data: {selectedItem.purchase_date}
                  </Text>
                )}
              </View>
            )}

          {selectedOption === "smartbills" && selectedItem && (
            <ScrollView>
              <View style={{ paddingBottom: 16 }}>
                <View>
                  <Text style={styles.modalTitle}>
                    {selectedItem.name} - {selectedItem.establishment_location}
                  </Text>
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
          <View style={{ gap: 16, paddingTop: 16 }}>
            {selectedOption === "smartbills" && (
              <Button onPress={handleDelete} variant="danger" title="Apagar" />
            )}
            <Button onPress={onClose} variant="secondary" title="Fechar" />
          </View>

          {showDeleteConfirmation && (
            <View style={styles.confirmationOverlay}>
              <View style={styles.confirmationDialog}>
                <Text style={styles.confirmationTitle}>Confirmar Exclusão</Text>
                <Text style={styles.confirmationText}>
                  Tem a certeza que deseja apagar esta fatura? Esta ação não
                  pode ser desfeita.
                </Text>
                <View style={styles.confirmationButtons}>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={confirmDelete}
                      variant="danger"
                      title="Apagar"
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
