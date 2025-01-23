import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { fetchSuppliers } from '../api/api'; // API function to fetch suppliers

const SuppliersScreen = ({ navigation }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await fetchSuppliers(); // Call the API to get suppliers
      setSuppliers(data.data); // Assuming the response contains a "data" field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const navigateToCreate = () => {
    navigation.navigate('CreateSupplier'); // Navigate to the supplier creation screen
  };

  const navigateToDetails = (supplier) => {
    navigation.navigate('SupplierDetails', { supplier }); // Pass the supplier details
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading suppliers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suppliers List</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.supplier_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetails(item)}>
            <View style={styles.item}>
              {item.image && <Image source={{ uri: item.image }} style={styles.thumbnail} />}
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text>Contact: {item.contact_name}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Phone: {item.phone_number}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Add New Supplier" onPress={navigateToCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
  itemTitle: { fontWeight: 'bold', fontSize: 18 },
  thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  textContainer: { flex: 1 },
});

export default SuppliersScreen;
