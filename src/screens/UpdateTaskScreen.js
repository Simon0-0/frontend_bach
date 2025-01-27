import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { updateTask, fetchEmployees } from '../api/api';

const UpdateTaskScreen = ({ route, navigation }) => {
  const { task, onTaskUpdated } = route.params;

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskStatus, setTaskStatus] = useState(task.status || 'To Do');
  const [taskPriority, setTaskPriority] = useState(task.priority || 'Medium');
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date) : new Date());
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };
    loadEmployees();
  }, []);

  const handleUpdate = async () => {
    const updatedTask = {
      task_id: task.task_id,
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      due_date: dueDate.toISOString().split("T")[0],
    };

    try {
      const response = await updateTask(updatedTask);
      if (response.message === "Task updated successfully.") {
        Alert.alert("Success", "Task updated successfully.");
        if (onTaskUpdated) {
          onTaskUpdated(updatedTask);
        }
        navigation.goBack();
      } else {
        throw new Error(response.message || "Update failed.");
      }
    } catch (error) {
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
      <Picker selectedValue={taskStatus} onValueChange={setTaskStatus} style={styles.picker}>
        <Picker.Item label="To Do" value="To Do" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>

      <Text style={styles.label}>Priority</Text>
      <Picker selectedValue={taskPriority} onValueChange={setTaskPriority} style={styles.picker}>
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>

      <Text style={styles.label}>Assigned To</Text>
      <Picker selectedValue={assignedTo} onValueChange={setAssignedTo} style={styles.picker}>
        <Picker.Item label="Unassigned" value="" />
        {employees.map((emp) => (
          <Picker.Item key={emp.employee_id} label={emp.name} value={String(emp.employee_id)} />
        ))}
      </Picker>

      <Text style={styles.label}>Due Date</Text>
      <DatePicker
        selected={dueDate}
        onChange={setDueDate}
        dateFormat="yyyy-MM-dd"
        className="web-datepicker"
      />

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
  picker: { borderWidth: 1, marginBottom: 15, borderColor: '#ccc', backgroundColor: '#fff' },
});

export default UpdateTaskScreen;
