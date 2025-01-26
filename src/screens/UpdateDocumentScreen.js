import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateDocument } from '../api/api';

const UpdateDocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;

  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [fileLink, setFileLink] = useState(document.file_link || ''); // ✅ Store file link

  const handleUpdate = async () => {
    const updatedDocument = {
      document_id: document.document_id,
      title,
      content,
      file_link: fileLink, // ✅ Ensure file link is updated
    };

    console.log("🚀 Sending Updated Document:", updatedDocument);

    try {
      const response = await updateDocument(updatedDocument);
      console.log("✅ API Response:", response);

      Alert.alert("Success", "Document updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("Error", "Failed to update document.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Document</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Content</Text>
      <TextInput style={styles.input} value={content} onChangeText={setContent} />

      <Text style={styles.label}>Document Link (HTTP URL)</Text>
      <TextInput style={styles.input} value={fileLink} onChangeText={setFileLink} placeholder="Enter a link" />

      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});

export default UpdateDocumentScreen;
