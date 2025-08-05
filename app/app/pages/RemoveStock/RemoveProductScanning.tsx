import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductInfoModal from '../../../components/ProductInfoModal';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.7;

const RemoveProductScanning = () => {
  const [facing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [scanned, setScanned] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const cameraRef = useRef<any>(null);
  const [showCamera, setShowCamera] = useState(true);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10, color: '#D32F2F' }}>No Access To Camera Permission</Text>
        <Button
          title={'Allow Camera'}
          onPress={requestPermission}
          color="#D32F2F"
        />
      </View>
    );
  }

  // Handle QR scan
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    let parsed: any = null;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      parsed = {};
      const lines = data.split(/\r?\n/);
      lines.forEach(line => {
        const match = line.match(/([A-Za-z0-9_]+)\s*[:=]\s*['"]?([^'"]+)['"]?/);
        if (match) {
          parsed[match[1].trim().toLowerCase()] = match[2].trim();
        }
      });
    }
    if (parsed.productId) {
      setProductData(parsed);
      setShowProductModal(true);
      setTimeout(() => setScanned(false), 1000);
    } else {
      Alert.alert('Invalid QR', 'Please scan the correct product QR code.');
      setTimeout(() => setScanned(false), 1000);
    }
  };

  // Handler for closing the modal and moving to rack scan
  const handleScanRack = () => {
    setShowProductModal(false);
    setShowCamera(false);
    setTimeout(() => {
      router.push({
        pathname: '/pages/RemoveStock/RemoveRackScanning',
        params: productData
      });
    }, 400);
  };

  return (
    <View style={styles.container}>
      {/* Back arrow in top left */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={32} color="#f6f6f6" />
      </TouchableOpacity>

      {/* Product Info Modal */}
      <ProductInfoModal
        visible={showProductModal}
        productData={productData}
        onClose={() => setShowProductModal(false)}
        onScanRack={handleScanRack}
      />

      <View style={styles.centerContent}>
        <Text style={styles.title}>Remove Stock</Text>
        <View style={styles.scanBoxWrapper}>
          {showCamera && (
            <CameraView
              style={styles.scanBox}
              facing={facing}
              ref={cameraRef}
              onCameraReady={() => setIsCameraReady(true)}
              enableTorch={false}
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          )}
        </View>
        <Text style={styles.scanText}>SCAN PRODUCT QR</Text>
      </View>
    </View>
  );
};

export default RemoveProductScanning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.13,
  },
  title: {
    color: '#D32F2F',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'sans-serif',
    letterSpacing: 1,
    marginBottom: 30,
    textAlign: 'center',
  },
  scanBoxWrapper: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  scanText: {
    color: '#D32F2F',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'sans-serif',
    letterSpacing: 1,
    marginTop: 10,
    textAlign: 'center',
  },
});