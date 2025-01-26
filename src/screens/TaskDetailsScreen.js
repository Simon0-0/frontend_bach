import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveTask } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [updatedTask, setUpdatedTask] = useState(task);
  const [userInfo, setUserInfo] = useState(null);

  // ✅ Load user info from AsyncStorage
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1])); // ✅ Decode JWT token
        setUserInfo(payload.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    getUserInfo();
  }, []);
  const navigateToUpdate = () => {
    navigation.navigate('UpdateTask', {
      task: updatedTask,
      onTaskUpdated: (newTask) => {
        console.log("🆕 Updated Task Received:", newTask);
        setUpdatedTask(newTask); // ✅ Update assigned_to immediately
      },
    });
  };

  const handleArchive = async () => {
    try {
      await archiveTask(updatedTask.task_id);
      Alert.alert('Success', 'Task archived successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to archive task.');
      console.error(error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{updatedTask.title}</Text>
      <Text style={styles.detail}>Description: {updatedTask.description}</Text>
      <Text style={styles.detail}>Status: {updatedTask.status}</Text>
      <Text style={styles.detail}>Priority: {updatedTask.priority}</Text>
      <Text style={styles.detail}>
        Assigned To: {updatedTask.assigned_to ? `Employee ID: ${updatedTask.assigned_to}` : 'Unassigned'}
      </Text>
      <Text style={styles.detail}>Due Date: {updatedTask.due_date || 'N/A'}</Text>
      <Text style={styles.detail}>Created At: {updatedTask.created_at}</Text>
      <Text style={styles.detail}>Updated At: {updatedTask.updated_at}</Text>

      <View style={styles.buttonContainer}>

        {(userInfo &&
          (userInfo.role_id === 1 || userInfo.role_id === 2 )) && (

            <Button title="Edit Task" onPress={navigateToUpdate} />
          )}


        {(userInfo &&
          (userInfo.role_id === 1 || userInfo.role_id === 2 )) && (

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
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default TaskDetailsScreen;
