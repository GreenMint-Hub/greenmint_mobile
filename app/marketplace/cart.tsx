import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Button from '@/components/Button';
import { useCartStore } from '@/store/cartStore';
import Colors from '@/constants/Colors';

export default function CartPage() {
  const { items, loadCart, removeFromCart, updateQuantity, clearCart, checkout } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    loadCart();
  }, []);

  const handleCheckout = async () => {
    await checkout();
    Alert.alert('Checkout', 'Order placed successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.image} />
              )}
              <View style={styles.info}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Button title="Remove" onPress={() => removeFromCart(item.id)} style={styles.removeBtn} />
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Button title="Checkout" onPress={handleCheckout} disabled={items.length === 0} />
        <Button title="Clear Cart" onPress={clearCart} disabled={items.length === 0} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: Colors.textLight, textAlign: 'center', marginTop: 32 },
  itemRow: { flexDirection: 'row', marginBottom: 16, backgroundColor: Colors.backgroundLight, borderRadius: 8, padding: 8 },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  price: { color: Colors.primary, marginVertical: 4 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  qtyBtn: { backgroundColor: Colors.primary, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  qtyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  quantity: { marginHorizontal: 12, fontSize: 16 },
  removeBtn: { marginTop: 8, backgroundColor: '#eee' },
  footer: { borderTopWidth: 1, borderColor: Colors.border, paddingTop: 16, marginTop: 16, alignItems: 'center' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});