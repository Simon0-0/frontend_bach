import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createTask, fetchEmployees } from '../api/api';

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
        due_date: dueDate.toISOString().split('T')[0],
      };

      const response = await createTask(payload);
      Alert.alert('Success', 'Task created successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter Title" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter Description" />

      <Text style={styles.label}>Status</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
        <Picker.Item label="To Do" value="To Do" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>

      <Text style={styles.label}>Priority</Text>
      <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
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
      {Platform.OS === 'web' ? (
        <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} dateFormat="yyyy-MM-dd" className="web-datepicker" />
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
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
  picker: { borderWidth: 1, marginBottom: 15, borderColor: '#ccc', backgroundColor: '#fff' },
  datePicker: { borderWidth: 1, padding: 10, borderRadius: 5, borderColor: '#ccc', marginBottom: 15, alignItems: 'center' },
  dateText: { fontSize: 16, color: '#333' },
});

export default CreateTaskScreen;
