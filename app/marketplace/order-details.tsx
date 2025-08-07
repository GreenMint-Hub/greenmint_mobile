import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

export default function OrderDetailsPage() {
  const { token } = useUserStore();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    axios.get(`${API_CONFIG.API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
  if (!order) return <View style={styles.container}><Text>Order not found.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order._id.slice(-6)}</Text>
      <Text style={styles.date}>{new Date(order.createdAt).toLocaleString()}</Text>
      <FlatList
        data={order.items}
        keyExtractor={item => item.productId}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)} x {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  date: { color: Colors.textLight, marginBottom: 16 },
  itemRow: { flexDirection: 'row', marginBottom: 12, backgroundColor: Colors.backgroundLight, borderRadius: 8, padding: 8 },
  image: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  price: { color: Colors.primary, marginTop: 4 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: Colors.primary },
});