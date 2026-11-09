import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ConfirmationScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Success Icon */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              {/* <Icon name="check" size={32} color="#fff" /> */}
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={32} color="#fff" />
            </View>
          </View>
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. A confirmation email has been sent to your inbox.
        </Text>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal (1 item)</Text>
            <Text style={styles.summaryValue}>$25.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping (Standard)</Text>
            <Text style={styles.summaryValue}>$5.00</Text>
          </View> 
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Tax</Text>
            <Text style={styles.summaryValue}>$2.50</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryTotalLabel}>Order Total</Text>
            <Text style={styles.summaryTotalValue}>$32.50</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>View Order Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  successIconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconOuter: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 9999,
  },
  successIconInner: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 9999,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  orderSummary: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'left',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#6B7280',
  },
  summaryValue: {
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#137fec',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 16,
  },
});

