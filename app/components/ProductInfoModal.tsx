import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductInfoModalProps {
  visible: boolean;
  productData: {
    productId?: string;
    productName?: string;
    weight?: string;
    quantity?: number;
  } | null;
  onClose: () => void;
  onScanRack: () => void;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ visible, productData, onClose, onScanRack }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.label}><Text style={styles.key}>PRODUCT_ID:</Text> <Text style={styles.value}>&quot;{productData?.productId || ''}&quot;</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>PRODUCT_NAME:</Text> <Text style={styles.value}>&quot;{productData?.productName || ''}&quot;</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>WEIGHT :</Text> <Text style={styles.value}>{productData?.weight || ''}</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>QTY :</Text> <Text style={styles.value}>{productData?.quantity || ''}</Text></Text>
          <TouchableOpacity style={styles.button} onPress={onScanRack}>
            <Text style={styles.buttonText}>SCAN RACK QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#181818',
    padding: 28,
    borderRadius: 28,
    minWidth: 260,
    alignItems: 'center',
  },
  label: {
    color: '#28a263',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  key: {
    color: '#28a263',
    fontWeight: '700',
  },
  value: {
    color: '#f6f6f6',
    fontWeight: '400',
  },
  cardText: {
    color: '#bdbdbd',
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#28a263',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default ProductInfoModal; 