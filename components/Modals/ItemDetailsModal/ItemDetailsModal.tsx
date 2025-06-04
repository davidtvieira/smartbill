import type { DataType } from "@/app/screens/FilterScreen/FilterScreen";
import { getProductsBySmartBill } from "@/services/database/queries";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styleItemDetailsModal";

interface ItemDetailsModalProps {
  visible: boolean;
  selectedItem: any | null;
  selectedOption: DataType;
  onClose: () => void;
}

interface Product {
  name: string;
  quantity: number;
  unit_price: number;
}

export default function ItemDetailsModal({
  visible,
  selectedItem,
  selectedOption,
  onClose,
}: ItemDetailsModalProps) {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    if (selectedOption === "smartbills" && selectedItem?.id) {
      getProductsBySmartBill(selectedItem.id).then(setProducts);
    } else {
      setProducts([]);
    }
  }, [selectedOption, selectedItem?.id]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalhes</Text>

          {selectedOption === "products" && selectedItem && (
            <View>
              <Text style={styles.modalText}>Nome: {selectedItem.name}</Text>
              <Text style={styles.modalText}>
                Quantidade: {selectedItem.quantity}
              </Text>
              <Text style={styles.modalText}>
                Preço Unitário: {selectedItem.unit_price}
              </Text>
              <Text style={styles.modalText}>
                Total: {selectedItem.quantity * selectedItem.unit_price}
              </Text>
              <Text style={styles.modalText}>
                Data de Compra: {selectedItem.purchase_date}
              </Text>
              <Text style={styles.modalText}>
                Hora: {selectedItem.purchase_time}
              </Text>
              <Text style={styles.modalText}>
                Estabelecimento: {selectedItem.establishment_name}
              </Text>
              <Text style={styles.modalText}>
                Localização: {selectedItem.establishment_location}
              </Text>
              <Text style={styles.modalText}>
                Categoria: {selectedItem.category_name}
              </Text>
              {selectedItem.subcategory_name && (
                <Text style={styles.modalText}>
                  Subcategoria: {selectedItem.subcategory_name}
                </Text>
              )}
            </View>
          )}
          <ScrollView>
            {selectedOption === "smartbills" && selectedItem && (
              <View style={{ gap: 16 }}>
                <View style={{ paddingBottom: 16 }}>
                  <Text style={styles.modalText}>
                    Estabelecimento: {selectedItem.establishment_name}
                  </Text>
                  <Text style={styles.modalText}>
                    Localização: {selectedItem.establishment_location}
                  </Text>
                  <Text style={styles.modalText}>
                    Data: {selectedItem.purchase_date}
                  </Text>
                  <Text style={styles.modalText}>
                    Hora: {selectedItem.purchase_time}
                  </Text>
                  <Text style={styles.modalText}>
                    Total: {selectedItem.amount}€
                  </Text>
                </View>

                {products.map((product, index) => (
                  <View key={index}>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      {product.name}
                    </Text>
                    <Text style={styles.modalText}>
                      Quantidade: {product.quantity}
                    </Text>
                    <Text style={styles.modalText}>
                      Preço Unitário: {product.unit_price}€
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
