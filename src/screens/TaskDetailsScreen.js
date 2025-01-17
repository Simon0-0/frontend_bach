import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveTask } from '../api/api';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const navigateToUpdate = () => {
    navigation.navigate('UpdateTask', { task });
  };

  const handleArchive = async () => {
    try {
      await archiveTask(task.task_id);
      Alert.alert('Success', 'Task archived successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to archive task.');
      console.error(error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.detail}>Description: {task.description}</Text>
      <Text style={styles.detail}>Status: {task.status}</Text>
      <Text style={styles.detail}>Priority: {task.priority}</Text>
      <Text style={styles.detail}>Assigned To: {task.assigned_to || 'Unassigned'}</Text>
      <Text style={styles.detail}>Due Date: {task.due_date || 'N/A'}</Text>
      <Text style={styles.detail}>Created At: {task.created_at}</Text>
      <Text style={styles.detail}>Updated At: {task.updated_at}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Edit Task" onPress={navigateToUpdate} />
        <Button title="Done Task" onPress={handleArchive} color="red" />
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
