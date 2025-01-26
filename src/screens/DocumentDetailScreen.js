import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Linking, Alert } from 'react-native';
import { archiveDocument } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';

const DocumentDetailScreen = ({ route, navigation }) => {
  const { document } = route.params;
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

  const navigateToUpdate = () => {
    navigation.navigate('UpdateDocument', { document });
  };

  const handleArchive = async () => {
    try {
      await archiveDocument(document.document_id);
      Alert.alert("Success", "Document archived successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to archive document.");
      console.error(error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.detail}>Content: {document.content}</Text>
      <Text style={styles.detail}>Created By: {document.created_by}</Text>
      <Text style={styles.detail}>Created At: {document.created_at}</Text>
      <Text style={styles.detail}>Updated At: {document.updated_at}</Text>

      {/* ✅ Show Document Link */}
      {document.file_link ? (
        <Text style={styles.link} onPress={() => Linking.openURL(document.file_link)}>
          Open Document
        </Text>
      ) : (
        <Text style={styles.noFile}>No link provided</Text>
      )}

      <View style={styles.buttonContainer}>

         {(userInfo &&
                              (userInfo.role_id === 1 || userInfo.role_id === 2 )) && (
                                <Button title="Edit Document" onPress={navigateToUpdate} />
                                 )}
        {(userInfo &&
                              (userInfo.role_id === 1 || userInfo.role_id === 2 )) && (
                                <Button title="Archive Document" onPress={handleArchive} color="red" />
                                 )}
        
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 10 },
  link: { fontSize: 16, color: 'blue', marginBottom: 10, textAlign: 'center' },
  noFile: { fontSize: 16, color: 'gray', textAlign: 'center' },
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default DocumentDetailScreen;
