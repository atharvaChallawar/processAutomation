import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 320;

export default function LandingPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: 28 * scale, marginBottom: 30 * scale }]}>StockOps</Text>
          <View style={[styles.buttonContainer, { gap: 20 * scale, width: 220 * scale }]}>
            <TouchableOpacity
              style={[styles.button, styles.addButton, { paddingVertical: 8 * scale, paddingHorizontal: 10 * scale }]}
              onPress={() => router.push('/pages/AddStock/productScanning')}
            >
              <Text style={[styles.buttonText, { fontSize: 10 * scale }]}>ADD STOCK</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.removeButton, { paddingVertical: 8 * scale, paddingHorizontal: 10 * scale }]}
              onPress={() => router.push('/pages/RemoveStock/RemoveProductScanning')}
            >
              <Text style={[styles.buttonText, { fontSize: 10 * scale }]}>REMOVE STOCK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40 * scale,
  },
  title: {
    fontWeight: '700',
    color: '#28a263',
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#00C853',
  },
  removeButton: {
    backgroundColor: '#D32F2F',
  },
});
