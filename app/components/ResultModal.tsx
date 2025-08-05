import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResultModalProps {
  visible: boolean;
  success: boolean;
  onClose: () => void;
  message?: string;
}

const ResultModal: React.FC<ResultModalProps> = ({ visible, success, onClose, message }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.statusText, { color: success ? '#28a263' : '#D32F2F' }]}> 
            {success ? 'SUCCESSFULL' : 'FAILED'}
          </Text>
          <View style={[styles.iconCircle, { backgroundColor: success ? '#28a263' : '#D32F2F' }] }>
            <Ionicons
              name={success ? 'checkmark' : 'close'}
              size={64}
              color="#fff"
              style={{ alignSelf: 'center' }}
            />
          </View>
          <Text style={styles.message}>
            {message ? message : (success
              ? 'PRODUCT ADDED SUCCESSFULLY\nTO THE RACK'
              : 'FAILED TO ADD PRODUCT\nTO THE RACK')}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: success ? '#28a263' : '#D32F2F' }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{success ? 'Done' : 'Retry'}</Text>
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
    backgroundColor: '#232323',
    padding: 28,
    borderRadius: 32,
    minWidth: 300,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  iconCircle: {
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    ...(Platform.OS === 'android' && { elevation: 4 }),
  },
  message: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default ResultModal; 