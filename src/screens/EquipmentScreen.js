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
import { fetchEquipment } from '../api/api'; // API call for fetching equipment
import { useFocusEffect } from '@react-navigation/native'; // Refresh on focus
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';
// ✅ Set Correct BASE_URL (Ensure it's accessible)
const BASE_URL = "http://localhost/bch_final_project/";

const EquipmentScreen = ({ navigation }) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // ✅ Load user info from AsyncStorage
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1])); // ✅ Decode JWT token
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

      {equipment.length === 0 ? (
        <Text style={styles.emptyMessage}>No equipment available.</Text>
      ) : (
        <FlatList
          data={equipment}
          keyExtractor={(item) => item.equipment_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetails(item)}>
              <View style={styles.item}>
                {/* ✅ Display Equipment Thumbnail with Fallback */}
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
                  <Text>Warranty Expiration: {item.warranty_expiration || 'N/A'}</Text>
                  <Text>Assigned To: {item.assigned_to || 'Unassigned'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
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
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
  itemTitle: { fontWeight: 'bold', fontSize: 18 },
  thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  textContainer: { flex: 1 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
});

export default EquipmentScreen;
