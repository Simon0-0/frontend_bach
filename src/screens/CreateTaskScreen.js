import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // For Android/iOS
import DatePicker from 'react-datepicker'; // For Web
import 'react-datepicker/dist/react-datepicker.css'; // Web styles
import { createTask } from '../api/api';

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        due_date: dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
  
      console.log('Creating task with payload:', payload);
  
      const response = await createTask(payload);
      console.log('API Response:', response); // Debug API response
  
      Alert.alert('Success', 'Task created successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create task.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
      <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder="Status" />
      <TextInput style={styles.input} value={priority} onChangeText={setPriority} placeholder="Priority" />
      <TextInput style={styles.input} value={assignedTo} onChangeText={setAssignedTo} placeholder="Assigned To (Employee ID)" keyboardType="numeric" />

      {/* Platform-Specific Date Picker */}
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="yyyy-MM-dd"
          className="web-datepicker"
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{dueDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Button title="Create Task" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
  datePicker: { borderWidth: 1, padding: 10, borderRadius: 5, borderColor: '#ccc', marginBottom: 15, alignItems: 'center' },
  dateText: { fontSize: 16, color: '#333' },
});

export default CreateTaskScreen;
