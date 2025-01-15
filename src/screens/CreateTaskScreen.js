import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createTask } from '../api/api';

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = async () => {
    if (!title || !description || !status) {
      Alert.alert('Error', 'Title, description, and status are required.');
      return;
    }

    try {
      const payload = {
        title,
        description,
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
        due_date: dueDate,
      };

      await createTask(payload);
      Alert.alert('Success', 'Task created successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task.');
      console.error(error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
      <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder="Status" />
      <TextInput style={styles.input} value={priority} onChangeText={setPriority} placeholder="Priority" />
      <TextInput style={styles.input} value={assignedTo} onChangeText={setAssignedTo} placeholder="Assigned To (Employee ID)" />
      <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} placeholder="Due Date (YYYY-MM-DD)" />
      <Button title="Create Task" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
});

export default CreateTaskScreen;
