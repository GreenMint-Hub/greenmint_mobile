import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

export default function OrdersPage() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get(`${API_CONFIG.API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderRow}
              onPress={() => router.push({ pathname: '/marketplace/order-details', params: { id: item._id } })}
            >
              <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
              <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: Colors.textLight, textAlign: 'center', marginTop: 32 },
  orderRow: { backgroundColor: Colors.backgroundLight, borderRadius: 8, padding: 16, marginBottom: 12 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  orderDate: { color: Colors.textLight, marginTop: 4 },
  orderTotal: { color: Colors.primary, fontWeight: 'bold', marginTop: 4 },
});