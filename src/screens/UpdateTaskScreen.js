import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateTask } from '../api/api';

const UpdateTaskScreen = ({ route, navigation }) => {
  const { task, onTaskUpdated } = route.params; // ✅ Use route.params to receive function

  // ✅ Ensure all states are initialized
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskPriority, setTaskPriority] = useState(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [dueDate, setDueDate] = useState(task.due_date || '');

  const handleUpdate = async () => {
    const updatedTask = {
      task_id: task.task_id,
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      due_date: dueDate,
    };

    console.log("🚀 Sending Updated Task:", updatedTask);

    try {
      const response = await updateTask(updatedTask);
      console.log("✅ API Response:", response);

      if (response.message === "Task updated successfully.") {
        Alert.alert("Success", "Task updated successfully.");

        // ✅ Pass updated task back to TaskDetailsScreen
        if (onTaskUpdated) {
          onTaskUpdated(updatedTask);
        }

        navigation.goBack();
      } else {
        throw new Error(response.message || "Update failed.");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={taskTitle} onChangeText={setTaskTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={taskDescription} onChangeText={setTaskDescription} />

      <Text style={styles.label}>Status</Text>
      <TextInput style={styles.input} value={taskStatus} onChangeText={setTaskStatus} />

      <Text style={styles.label}>Priority</Text>
      <TextInput style={styles.input} value={taskPriority} onChangeText={setTaskPriority} />

      <Text style={styles.label}>Assigned To (Employee ID)</Text>
      <TextInput style={styles.input} value={assignedTo} onChangeText={setAssignedTo} keyboardType="numeric" />

      <Text style={styles.label}>Due Date</Text>
      <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />

      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});

export default UpdateTaskScreen;
