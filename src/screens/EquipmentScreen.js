import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { fetchEquipment } from '../api/api'; 
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost/bch_final_project/";

const EquipmentScreen = ({ navigation }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showMyEquipment, setShowMyEquipment] = useState(false); // ✅ Toggle state

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1])); 
        setUserInfo(payload.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    getUserInfo();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetchEquipment();
      console.log("📡 Equipment API Response:", response);

      if (response.data && Array.isArray(response.data)) {
        setEquipment(response.data);
        setFilteredEquipment(response.data); // ✅ Initially set all equipment
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error("❌ Failed to fetch equipment:", err);
      setError(err.response?.data?.message || 'Failed to fetch equipment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEquipment();
    }, [])
  );

  const navigateToCreate = () => {
    navigation.navigate('CreateEquipment');
  };

  const navigateToDetails = (item) => {
    navigation.navigate('EquipmentDetails', { equipment: item });
  };

  // ✅ Toggle between All Equipment and My Equipment
  const toggleEquipmentFilter = () => {
    if (!showMyEquipment) {
      setFilteredEquipment(equipment.filter(equip => equip.assigned_to === userInfo.employee_id));
    } else {
      setFilteredEquipment(equipment);
    }
    setShowMyEquipment(!showMyEquipment);
  };

  console.log("🎯 Equipment List:", equipment);

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

      {/* ✅ Filtering Button */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleEquipmentFilter}>
        <Text style={styles.filterButtonText}>
          {showMyEquipment ? "Show All Equipment" : "Show My Equipment"}
        </Text>
      </TouchableOpacity>

      {filteredEquipment.length === 0 ? (
        <Text style={styles.emptyMessage}>No equipment available.</Text>
      ) : (
        <FlatList
          data={filteredEquipment}
          keyExtractor={(item) => item.equipment_id.toString()}
          renderItem={({ item }) => {
            const currentDate = new Date();
            const warrantyDate = item.warranty_expiration ? new Date(item.warranty_expiration) : null;
            const isExpired = warrantyDate && warrantyDate < currentDate;

            return (
              <TouchableOpacity onPress={() => navigateToDetails(item)}>
                <View style={styles.item}>
                  <Image
                    source={
                      item.image_path
                        ? { uri: new URL(item.image_path, BASE_URL).href }
                        : require('../../assets/no-image.png')
                    }
                    style={styles.thumbnail}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text>{item.description}</Text>
                    <Text>Status: {item.status}</Text>
                    <Text style={[styles.warrantyText, isExpired && styles.expiredWarranty]}>
                      Warranty Expiration: {item.warranty_expiration || 'N/A'}
                    </Text>
                    <Text>Assigned To: {item.assigned_to || 'Unassigned'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ height: 50 }} />}
        />
      )}

      {(userInfo &&
        (userInfo.role_id === 1 || userInfo.role_id === 2 || userInfo.employee_id === equipment.assigned_to)) && (
        <Button title="Add New Equipment" onPress={navigateToCreate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  filterButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "right",
    
  },
  filterButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
  itemTitle: { fontWeight: 'bold', fontSize: 18 },
  thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  textContainer: { flex: 1 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  warrantyText: { fontSize: 16 },
  expiredWarranty: { color: 'red' },
});

export default EquipmentScreen;
