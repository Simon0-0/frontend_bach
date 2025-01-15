import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateDocument } from '../api/api';

const UpdateDocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;

  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);

  const handleUpdate = async () => {
    try {
      const payload = {
        document_id: document.document_id,
        title,
        content,
      };

      await updateDocument(payload);
      Alert.alert('Success', 'Document updated successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update document.');
      console.error(err.message || err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Document</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />
      <Button title="Update Document" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
});

export default UpdateDocumentScreen;
