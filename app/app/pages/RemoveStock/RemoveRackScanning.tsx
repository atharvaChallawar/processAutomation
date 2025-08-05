import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RackInfoModal from '../../../components/RackInfoModal';
import ResultModal from '../../../components/ResultModal';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.7;

export default function RemoveRackScanning() {
  const [facing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showRackModal, setShowRackModal] = useState(false);
  const [rackData, setRackData] = useState<any>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(true);
  const [resultMessage, setResultMessage] = useState('');
  const cameraRef = useRef<any>(null);
  const [cameraKey, setCameraKey] = useState(0);

  // Fetch product data from navigation params
  const params = useLocalSearchParams();
  const productData = {
    productId: params.productId as string,
    productName: params.productName as string,
    weight: params.weight as string,
    quantity: params.quantity ? Number(params.quantity) : undefined,
  };

  // Reset camera and scanned state every time the screen is focused
  React.useEffect(() => {
    setIsCameraReady(false);
    setScanned(false);
    setCameraKey(prev => prev + 1);
  }, []);

  if (!permission) return <View style={styles.container}><Text style={{ color: '#fff' }}>Loading camera permission...</Text></View>;
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

  // Submit to backend and show result modal with message
  const submitToBackend = async (data: any) => {
    try {
      const res = await fetch('https://backend-aq7v.onrender.com/api/racks/remove-stock', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setResultSuccess(true);
        setResultMessage('Product removed successfully!');
      } else {
        setResultSuccess(false);
        setResultMessage(result.message|| 'Failed to remove product.');
      }
    } catch (e) {
      setResultSuccess(false);
      setResultMessage('Failed to connect to backend.');
    }
    setShowResultModal(true);
  };

  // Handle Done/Retry
  const handleDoneOrRetry = () => {
    setShowResultModal(false);
    setScanned(false);
    router.replace('/pages/RemoveStock/RemoveProductScanning');
  };

  // Handle QR scan
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned || showRackModal || showResultModal) return;
    setScanned(true);

    let parsed: any = null;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      parsed = {};
      const lines = data.split(/\r?\n/);
      lines.forEach(line => {
        const match = line.match(/([A-Za-z0-9_]+)\s*[:=]\s*['"]?([^'"\n]+)['"]?/);
        if (match) {
          parsed[match[1].trim().toLowerCase()] = match[2].trim();
        }
      });
    }

    if (parsed.rackId) {
      const combined = { ...productData, ...parsed };
      setRackData(combined);
      setShowRackModal(true);
      setTimeout(() => {
        setShowRackModal(false);
        submitToBackend(combined);
      }, 1200);
    } else {
      Alert.alert('Invalid QR', 'Please scan the correct rack QR code.');
      setTimeout(() => setScanned(false), 1000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back arrow in top left */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={32} color="#f6f6f6" />
      </TouchableOpacity>

      {/* Rack Info Modal */}
      <RackInfoModal
        visible={showRackModal}
        data={rackData}
        onClose={() => setShowRackModal(false)}
        onDone={() => setShowRackModal(false)}
      />

      {/* Result Modal */}
      <ResultModal
        visible={showResultModal}
        success={resultSuccess}
        message={resultMessage}
        onClose={handleDoneOrRetry}
      />

      <View style={styles.centerContent}>
        <Text style={styles.title}>Scan Rack QR</Text>
        <View style={styles.scanBoxWrapper}>
          {!showRackModal && !showResultModal && permission.granted && (
            <>
              <CameraView
                key={cameraKey}
                style={styles.scanBox}
                facing={facing}
                ref={cameraRef}
                onCameraReady={() => setIsCameraReady(true)}
                enableTorch={false}
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
              {!isCameraReady && (
                <View style={[styles.scanBox, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(34,34,34,0.85)', position: 'absolute', top: 0, left: 0, zIndex: 2 }]}> 
                  <Text style={{ color: '#fff' }}>Loading camera...</Text>
                </View>
              )}
            </>
          )}
        </View>
        <Text style={styles.scanText}>SCAN RACK QR</Text>
      </View>
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