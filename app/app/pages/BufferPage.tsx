import LogoLand from '@/assets/svg/logo_landing';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 320; // Use the smaller dimension for scaling

const BufferPage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/pages/LandingPage');
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: 47 * scale }]}>StockOps</Text>
          <Text style={[styles.subtitle, { fontSize: 12 * scale }]}>Stock Operations Made Easy</Text>
        </View >
        <View style={styles.logoContainer}>
          <LogoLand size={100 * scale} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    height: height,
  },
  content: {
    alignItems: 'center',
    gap: 50 * scale,
    marginTop: height * 0.15,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8 * scale,
  },
  title: {
    fontWeight: '700',
    color: '#00E676', // Bright green for main title
    letterSpacing: 2 * scale,
  },
  subtitle: {
    fontWeight: '400',
    color: '#F6f6f6', // Light teal for subtitle
    letterSpacing: 1 * scale,
    opacity: 0.9,
  },
  logoContainer: {
    marginTop: 50 * scale,
  },  
});

export default BufferPage;
