import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Mobile only
import DatePicker from 'react-datepicker'; // Web only
import 'react-datepicker/dist/react-datepicker.css'; // Web only
import { updateTask } from '../api/api';

const UpdateTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdate = async () => {
    try {
      const payload = {
        task_id: task.task_id,
        title,
        description,
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
        due_date: dueDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      };

      console.log('Updating task with payload:', payload);

      await updateTask(payload);
      alert('Task updated successfully.');
      navigation.goBack();
    } catch (err) {
      console.error('Update Error:', err.response?.data || err.message);
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
  datePicker: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 15,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UpdateTaskScreen;
