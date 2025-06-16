import Button from "@/components/Buttons/Button/Button";
import {
  deleteSmartBill,
  getProductsBySmartBill,
} from "@/services/database/queries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Função para carregar os produtos
  useEffect(() => {
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

  // Função para apagar a fatura
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Função para confirmar a apagada da fatura
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

  // Função para cancelar a apagada da fatura
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
          {/* Modal de detalhes de um produto */}
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
                {selectedItem.quantity && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Quantidade:</Text>
                    <Text style={styles.modalTextInfo}>
                      {selectedItem.quantity}
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
                {selectedItem.total_spent && (
                  <View style={styles.container}>
                    <Text style={styles.modalText}>Preço Total:</Text>
                    <Text style={styles.modalTextInfo}>
                      {(
                        selectedItem.unit_price * selectedItem.quantity
                      ).toFixed(2)}
                      €
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
          {/* Modal de detalhes de uma fatura */}
          {selectedOption === "smartbills" && selectedItem && (
            <ScrollView>
              <View style={{ paddingBottom: 20 }}>
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
                  {selectedItem.item_count && (
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Produtos:</Text>
                      <Text style={styles.modalTextInfo}>
                        {selectedItem.item_count}
                      </Text>
                    </View>
                  )}
                  {selectedItem.amount && (
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Total:</Text>
                      <Text style={styles.modalTextInfo}>
                        {selectedItem.amount}€
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View>
                {/* Lista de produtos */}
                {products.map((product, index) => (
                  <View style={{ paddingVertical: 10 }} key={index}>
                    {index > 0 && <View />}
                    <Text style={[styles.modalTitle]}>{product.name}</Text>
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Categoria:</Text>
                      <Text style={styles.modalTextInfo}>
                        {product.category_name}
                      </Text>
                    </View>
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Subcategoria:</Text>
                      <Text style={styles.modalTextInfo}>
                        {product.subcategory_name}
                      </Text>
                    </View>
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Quantidade:</Text>
                      <Text style={styles.modalTextInfo}>
                        {product.quantity}
                      </Text>
                    </View>
                    <View style={styles.container}>
                      <Text style={styles.modalText}>Preço Unitário:</Text>
                      <Text style={styles.modalTextInfo}>
                        {product.unit_price}€
                      </Text>
                    </View>

                    <View style={styles.container}>
                      <Text style={styles.modalText}>Total:</Text>
                      <Text style={styles.modalTextInfo}>
                        {(product.quantity * product.unit_price).toFixed(2)}€
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
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
            <Button onPress={onClose} variant="third" title="Fechar" />
          </View>

          {showDeleteConfirmation && (
            <View style={styles.confirmationOverlay}>
              <View style={styles.confirmationDialog}>
                <View style={styles.confirmationHeader}>
                  <MaterialIcons name="warning" size={24} color="white" />
                  <Text style={styles.confirmationTitle}>
                    Confirmar Exclusão
                  </Text>
                </View>
                <Text style={styles.confirmationMessage}>
                  Tens a certeza que deseja apagar esta fatura? Esta ação não
                  pode ser desfeita.
                </Text>
                <View style={styles.confirmationButtons}>
                  <View style={styles.confirmationButtonWrapper}>
                    <Button
                      onPress={cancelDelete}
                      variant="third"
                      title="Cancelar"
                    />
                  </View>
                  <View style={styles.confirmationButtonWrapper}>
                    <Button
                      onPress={confirmDelete}
                      variant="danger"
                      title="Sim, Apagar"
                      icon={
                        <MaterialIcons name="delete" size={20} color="white" />
                      }
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
