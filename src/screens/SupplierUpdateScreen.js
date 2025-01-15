import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateSupplier } from '../api/api';

const UpdateSupplierScreen = ({ route, navigation }) => {
  const { supplier } = route.params;

  const [name, setName] = useState(supplier.name);
  const [contactName, setContactName] = useState(supplier.contact_name);
  const [email, setEmail] = useState(supplier.email);
  const [phoneNumber, setPhoneNumber] = useState(supplier.phone_number);
  const [address, setAddress] = useState(supplier.address || '');
  const [city, setCity] = useState(supplier.city || '');
  const [country, setCountry] = useState(supplier.country || '');

  const handleUpdate = async () => {
    if (!name || !contactName || !email || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        supplier_id: supplier.supplier_id,
        name,
        contact_name: contactName,
        email,
        phone_number: phoneNumber,
        address,
        city,
        country,
      };

      await updateSupplier(supplier.supplier_id, payload);
      Alert.alert('Success', 'Supplier updated successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update supplier.');
      console.error(err.message || err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Supplier</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Supplier Name*" />
      <TextInput style={styles.input} value={contactName} onChangeText={setContactName} placeholder="Contact Name*" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email*" keyboardType="email-address" />
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number*" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
      <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Country" />
      <Button title="Update Supplier" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});

export default UpdateSupplierScreen;
