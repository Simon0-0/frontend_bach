import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchEquipment } from '../api/api'; // Your API call for fetching equipment
import { useFocusEffect } from '@react-navigation/native'; // To refresh the screen on focus

const EquipmentScreen = ({ navigation }) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const data = await fetchEquipment();
      setEquipment(data.data); // Assuming the response contains `data`
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch equipment.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh the equipment list when the screen is focused
  
  useFocusEffect(
    React.useCallback(() => {
      loadEquipment();
    }, [])
  );

  const navigateToCreate = () => {
    navigation.navigate('CreateEquipment'); // Navigate to create equipment screen
  };

  const navigateToDetails = (item) => {
    navigation.navigate('EquipmentDetails', { equipment: item }); // Navigate to equipment details
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading equipment...</Text>
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
      <Text style={styles.title}>Equipment List</Text>
      <FlatList
        data={equipment}
        keyExtractor={(item) => item.equipment_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetails(item)}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Assigned To: {item.assigned_to || 'Unassigned'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Add New Equipment" onPress={navigateToCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemTitle: { fontWeight: 'bold', fontSize: 18 },
});

export default EquipmentScreen;
