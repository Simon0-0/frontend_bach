import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createDocument } from "../api/api"; // Ensure the API function is correctly imported

const CreateDocumentScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(""); // Add status field

  // Handle form submission
  const handleCreate = async () => {
    // Validate required fields
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content are required.");
      return;
    }

    // Ensure status is included in the payload
    const payload = { title, content, status };

    console.log("🚀 Sending request with payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await createDocument(payload);
      console.log("API Response:", response);

      Alert.alert("Success", "Document created successfully.");
      navigation.goBack(); // Navigate back after creation
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert("Error", `Failed to create document. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Document</Text>
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
      <Button title="Create Document" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
});

export default CreateDocumentScreen;
