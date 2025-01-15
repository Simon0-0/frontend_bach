import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateTask } from '../api/api'; // Import the API function for updating tasks

const UpdateTaskScreen = ({ route, navigation }) => {
  const { task } = route.params; // Extract task details from route parameters

  // States for task fields
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [dueDate, setDueDate] = useState(task.due_date || '');

  const handleUpdate = async () => {
    try {
      const payload = {
        task_id: task.task_id, // Ensure task_id is included
        title,
        description,
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
        due_date,
      };
  
      console.log('Updating task with payload:', payload); // Debug the payload
  
      await updateTask(payload);
      alert('Task updated successfully.');
      navigation.goBack();
    } catch (err) {
      console.error('Update Error:', err.response?.data || err.message); // Debug error
      alert('Failed to update task.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title*"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description*"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Status* (e.g., Pending, In Progress, Completed)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Priority (e.g., High, Medium, Low)"
        value={priority}
        onChangeText={setPriority}
      />
      <TextInput
        style={styles.input}
        placeholder="Assigned To (Employee ID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Update Task" onPress={handleUpdate} />
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

export default UpdateTaskScreen;
