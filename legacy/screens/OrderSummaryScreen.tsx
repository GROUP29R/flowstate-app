import supabase from '@/db/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OrderSummary = () => {
  const router = useRouter();
  const { id, title, description, price, preview } = useLocalSearchParams();
  const [showPayment, setShowPayment] = useState(false);

    const handleConfirmPurchase = async () => {
    setShowPayment(true); // Optional: add loading screen

    setTimeout(async () => {
        // Simulated payment success
        await supabase.from('orders').insert({
        user_id: 'test-user',
        document_id: id,
        title,
        price: parseFloat(price.replace('R', '')),
        paid: true,
        });

        setShowPayment(false);
        router.push('/');
    }, 2000); // Simulate 2-second "payment"
    };

    if (showPayment) {
        return (
          <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Processing Payment...</Text>
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
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Items */}
        <Text style={styles.sectionTitle}>Items</Text>

        {/* Example Items */}
        <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={{ uri: preview }}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemSubtitle}>Numecis V1 Documentation</Text>
          </View>
          <Text style={styles.itemPrice}>R{price}</Text>
        </View>

        {/* <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={{ uri: 'https://via.placeholder.com/150?text=Shoes' }}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>Running Shoes</Text>
            <Text style={styles.itemSubtitle}>Size 8</Text>
          </View>
          <Text style={styles.itemPrice}>$30.00</Text>
        </View> */}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R{price}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>ex. VAT</Text>
          <Text style={styles.summaryValue}>2.95%</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{price}</Text>
        </View>
      </ScrollView>

      {/* Proceed to Payment Button */}
      <View style={styles.paymentContainer}>
        <TouchableOpacity style={styles.paymentButton} onPress={handleConfirmPurchase}>
          <Text style={styles.paymentText}>Confirm Purchase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: '#ffffff',
    fontWeight: '500',
  },
  itemSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
  },
  itemPrice: {
    color: '#ffffff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  paymentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#121212',
  },
  paymentButton: {
    backgroundColor: '#1380ec',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSummary;
