import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RackInfoModalProps {
  visible: boolean;
  data: {
    productId?: string;
    productName?: string;
    weight?: string;
    quantity?: number;
    rackId?: string;
  } | null;
  onClose: () => void;
  onDone: () => void;
}

const RackInfoModal: React.FC<RackInfoModalProps> = ({ visible, data, onClose, onDone }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.fetchedText}>RACK ID FETCHED</Text>
          <Text style={styles.label}><Text style={styles.key}>PRODUCT_ID:</Text> <Text style={styles.value}>&quot;{data?.productId || ''}&quot;</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>PRODUCT_NAME:</Text> <Text style={styles.value}>&quot;{data?.productName || ''}&quot;</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>WEIGHT :</Text> <Text style={styles.value}>{data?.weight || ''}</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>QTY :</Text> <Text style={styles.value}>{data?.quantity || ''}</Text></Text>
          <Text style={styles.label}><Text style={styles.key}>RACK_ID:</Text> <Text style={styles.value}>&quot;{data?.rackId || ''}&quot;</Text></Text>
          <TouchableOpacity style={styles.button} onPress={onDone}>
            <Text style={styles.buttonText}>DONE</Text>
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
    alignItems: 'flex-start',
  },
  fetchedText: {
    color: '#f6f6f6',
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 12,
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
  button: {
    backgroundColor: '#28a263',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default RackInfoModal; 