import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';
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
  const [imageUrl, setImageUrl] = useState(supplier.image_url || ''); // Preserve existing image URL

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
        image_url: imageUrl, // Store only the image URL
      };

      console.log("📡 Sending update request:", payload);

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
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Update Supplier</Text>

          <Text style={styles.text}>Supplier Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Supplier Name*" />

          <Text style={styles.text}>Contact Name</Text>
          <TextInput style={styles.input} value={contactName} onChangeText={setContactName} placeholder="Contact Name*" />

          <Text style={styles.text}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email*" keyboardType="email-address" />

          <Text style={styles.text}>Phone Number</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number*" keyboardType="phone-pad" />

          <Text style={styles.text}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />

          <Text style={styles.text}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />

          <Text style={styles.text}>Country</Text>
          <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Country" />

          <Text style={styles.text}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Enter Image URL"
            keyboardType="url"
          />

          {/* Show Image Preview */}
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Text style={styles.noImage}>No Image Available</Text>}

          <Button title="Update Supplier" onPress={handleUpdate} />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 620 },  // Keeping the exact styling you provided
  innerContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: 'center',
  },
  noImage: {
    fontSize: 16,
    color: "gray",
    textAlign: 'center',
    marginTop: 20,
  }
});

export default UpdateSupplierScreen;
