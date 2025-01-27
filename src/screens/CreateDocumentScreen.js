import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createDocument } from "../api/api"; // Ensure the API function is correctly imported

const CreateDocumentScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileLink, setFileLink] = useState(""); // ✅ Store file link

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content are required.");
      return;
    }

    const payload = { title, content, file_link: fileLink }; // ✅ Include file link

    try {
      const response = await createDocument(payload);
      Alert.alert("Success", "Document created successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", `Failed to create document. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Document</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter Title" />

      <Text style={styles.label}>Content</Text>
      <TextInput style={styles.input} value={content} onChangeText={setContent} placeholder="Enter Content" multiline />

      <Text style={styles.label}>Document Link (HTTP URL)</Text>
      <TextInput style={styles.input} value={fileLink} onChangeText={setFileLink} placeholder="Enter a link" />

      <Button title="Create Document" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: "#ccc" },
});

export default CreateDocumentScreen;
