import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveTask, fetchEmployeeById } from '../api/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [updatedTask, setUpdatedTask] = useState(task);
  const [userInfo, setUserInfo] = useState(null);
  const [assignedToName, setAssignedToName] = useState('Unassigned');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(payload.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const fetchAssignedEmployee = async () => {
      if (updatedTask.assigned_to) {
        try {
          const employee = await fetchEmployeeById(updatedTask.assigned_to);
          if (employee && employee.name) {
            setAssignedToName(employee.name);
          }
        } catch (err) {
          console.error("Error fetching assigned employee:", err);
        }
      }
    };

    getUserInfo();
    fetchAssignedEmployee();
  }, [updatedTask.assigned_to]);

  const navigateToUpdate = () => {
    navigation.navigate('UpdateTask', {
      task: updatedTask,
      onTaskUpdated: (newTask) => {
        setUpdatedTask(newTask);
      },
    });
  };

  const handleArchive = async () => {
    console.log("📌 Archiving Task ID:", task.task_id);
  
    if (!task.task_id) {
      Alert.alert("Error", "Task ID is missing.");
      return;
    }
  
    try {
      const response = await archiveTask(task.task_id);
      console.log("✅ Archive Response:", response);
  
      Alert.alert("Success", "Task archived successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Archive Error:", error.message || error);
      Alert.alert("Error", "Failed to archive task.");
    }
  };

  // ✅ Check if Task is Overdue
  const currentDate = new Date();
  const dueDate = updatedTask.due_date ? new Date(updatedTask.due_date) : null;
  const isOverdue = dueDate && dueDate < currentDate;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{updatedTask.title}</Text>
      <Text style={styles.detail}>Description: {updatedTask.description}</Text>
      <Text style={styles.detail}>Status: {updatedTask.status}</Text>
      <Text style={styles.detail}>Priority: {updatedTask.priority}</Text>
      <Text style={styles.detail}>Assigned To: {assignedToName}</Text>
      <Text style={[styles.detail, isOverdue && styles.overdue]}>
        Due Date: {updatedTask.due_date || 'N/A'}
      </Text>
      <Text style={styles.detail}>Created At: {updatedTask.created_at}</Text>
      <Text style={styles.detail}>Updated At: {updatedTask.updated_at}</Text>

      <View style={styles.buttonContainer}>
        {(userInfo && (userInfo.role_id === 1 || userInfo.role_id === 2)) && (
          <Button title="Edit Task" onPress={navigateToUpdate} />
        )}
        {(userInfo && (userInfo.role_id === 1 || userInfo.role_id === 2)) && (
          <Button title="Archive Task" onPress={handleArchive} color="red" />
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
  overdue: { color: 'red', fontWeight: 'bold' }, // ✅ Overdue tasks appear in red
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default TaskDetailsScreen;
