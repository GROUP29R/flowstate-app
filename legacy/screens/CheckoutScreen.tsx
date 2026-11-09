import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CheckoutScreen = () => {
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      router.push('/(screens)/OrderSummaryScreen');
    }, 2000);
  };

  if (placingOrder) {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#1380ec" />
        <Text style={styles.processingText}>Placing your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Shipping Address */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>John Doe</Text>
          <Text style={styles.infoText}>123 Main Street</Text>
          <Text style={styles.infoText}>Cape Town, South Africa</Text>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Visa **** 4242</Text>
          <Text style={[styles.infoText, { color: '#60a5fa' }]}>Change</Text>
        </View>

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>R150.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT (2.95%)</Text>
          <Text style={styles.summaryValue}>R4.43</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R154.43</Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  infoBox: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  summaryValue: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderColor: '#374151',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#111827',
  },
  orderButton: {
    backgroundColor: '#1380ec',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
});
