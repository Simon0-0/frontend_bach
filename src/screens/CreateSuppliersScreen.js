import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createSupplier } from '../api/api'; // API function to create a supplier
import { ScrollView } from 'react-native-web';

const CreateSupplierScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const handleCreate = async () => {
    if (!name || !contactName || !email || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        name,
        contact_name: contactName,
        email,
        phone_number: phoneNumber,
        address,
        city,
        country,
        image: image ? image.uri : null,
      };

      await createSupplier(payload); // Call the API function
      Alert.alert('Success', 'Supplier created successfully.');
      navigation.goBack(); // Go back to the suppliers list
    } catch (err) {
      Alert.alert('Error', 'Failed to create supplier. Please try again.');
      console.error(err.message || err);
    }
  };

  return (
    
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>Create New Supplier</Text>
      <TextInput
        style={styles.input}
        placeholder="Supplier Name*"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Name*"
        value={contactName}
        onChangeText={setContactName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email*"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number*"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <Button title="Select Image" onPress={selectImage} />
      {image && <Image source={image} style={styles.image} />}
      <Button title="Create Supplier" onPress={handleCreate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 600, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
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
});

export default CreateSupplierScreen;
