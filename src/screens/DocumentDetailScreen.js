import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveDocument } from '../api/api';

const DocumentDetailScreen = ({ route, navigation }) => {
  const { document } = route.params;

  const navigateToUpdate = () => {
    navigation.navigate('UpdateDocument', { document });
  };

  const handleArchive = async () => {
    try {
      await archiveDocument(document.document_id);
      Alert.alert('Success', 'Document archived successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to archive document.');
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

      <View style={styles.buttonContainer}>
        <Button title="Edit Document" onPress={navigateToUpdate} />
        <Button title="Archive Document" onPress={handleArchive} color="red" />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 10 },
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default DocumentDetailScreen;
