import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductInfoModal from '../../../components/ProductInfoModal';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.7;

export default function ProductScanning() {
  const [facing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [step, setStep] = useState<'product' | 'rack' | 'done'>('product');
  const [productData, setProductData] = useState<any>(null);
  const [rackData, setRackData] = useState<any>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const cameraRef = useRef<any>(null);
  const [showCamera, setShowCamera] = useState(true);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10, color: '#28a263' }}>No Access To Camera Permission</Text>
        <Button
          title={'Allow Camera'}
          onPress={requestPermission}
          color="#28a263"
        />
      </View>
    );
  }

  // Handle QR scan
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    let parsed: any = null;
    // Try JSON parse first
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      // Try to parse colon-separated key-value pairs
      parsed = {};
      const lines = data.split(/\r?\n/);
      lines.forEach(line => {
        const match = line.match(/([A-Za-z0-9_]+)\s*[:=]\s*['"]?([^'"]+)['"]?/);
        if (match) {
          parsed[match[1].trim().toLowerCase()] = match[2].trim();
        }
      });
    }
    // Accept both JSON and key-value text for product and rack
    if (step === 'product' && parsed.productId) {
      setProductData(parsed);
      setShowProductModal(true);
      setTimeout(() => setScanned(false), 1000); // allow next scan
    } else if (step === 'rack' && parsed.rackId) {
      setRackData(parsed);
      submitData(parsed);
    } else {
      Alert.alert('Invalid QR', 'Please scan the correct QR code.');
      setTimeout(() => setScanned(false), 1000);
    }
  };

  // Submit combined data to backend
  const submitData = async (rack: any) => {
    setLoading(true);
    const payload = {
      ...productData,
      ...rack,
    };
    try {
      const res = await fetch('https://backend-aq7v.onrender.com/api/racks/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setResult(json.product);
      setStep('done');
    } catch (err) {
      Alert.alert('Error', 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  // UI for summary after both scans
  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>PRODUCT ADDED</Text>
      <Text style={styles.summarySubtitle}>RACK ID FETCHED</Text>
      <Text style={styles.summaryLabel}><Text style={styles.summaryKey}>PRODUCT_ID:</Text> <Text style={styles.summaryValue}>{result?.productId}</Text></Text>
      <Text style={styles.summaryLabel}><Text style={styles.summaryKey}>PRODUCT_NAME:</Text> <Text style={styles.summaryValue}>{result?.productName}</Text></Text>
      <Text style={styles.summaryLabel}><Text style={styles.summaryKey}>WEIGHT:</Text> <Text style={styles.summaryValue}>{result?.weight}</Text></Text>
      <Text style={styles.summaryLabel}><Text style={styles.summaryKey}>QTY :</Text> <Text style={styles.summaryValue}>{result?.quantity}</Text></Text>
      <Text style={styles.summaryLabel}><Text style={styles.summaryKey}>RACK_ID :</Text> <Text style={styles.summaryValue}>{result?.rackId}</Text></Text>
      <Button title="Scan Another" color="#28a263" onPress={() => {
        setStep('product');
        setProductData(null);
        setRackData(null);
        setResult(null);
        setScanned(false);
      }} />
    </View>
  );

  // Handler for closing the modal and moving to rack scan
  const handleScanRack = () => {
    setShowProductModal(false);
    setShowCamera(false); // Unmount camera
    setTimeout(() => {
      router.push({
        pathname: '/pages/AddStock/rackScanning',
        params: productData
      });
    }, 400); // Slightly longer delay to ensure camera unmounts
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

      {loading ? (
        <View style={styles.centerContent}><ActivityIndicator size="large" color="#28a263" /></View>
      ) : step === 'done' ? (
        renderSummary()
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.title}>StockOps</Text>
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
          <Text style={styles.scanText}>
            {step === 'product' ? 'SCAN PRODUCT QR' : 'SCAN RACK QR'}
          </Text>
        </View>
      )}
    </View>
  );
}

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
    color: '#28a263',
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
    color: '#28a263',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'sans-serif',
    letterSpacing: 1,
    marginTop: 10,
    textAlign: 'center',
  },
  summaryContainer: {
    flex: 1,
    backgroundColor: '#bdbdbd',
    margin: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  summaryTitle: {
    color: '#181818',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  summarySubtitle: {
    color: '#181818',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryLabel: {
    color: '#f6f6f6',
    fontSize: 16,
    marginBottom: 4,
  },
  summaryKey: {
    color: '#28a263',
    fontWeight: '700',
  },
  summaryValue: {
    color: '#f6f6f6',
    fontWeight: '400',
  },
});