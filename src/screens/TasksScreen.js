import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchTasks } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showMyTasks, setShowMyTasks] = useState(false); // ✅ Toggle state

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

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data.data);
      setFilteredTasks(data.data); // ✅ Initially set all tasks
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const navigateToCreate = () => {
    navigation.navigate('CreateTask');
  };

  const navigateToDetails = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  // ✅ Toggle between All Tasks and My Tasks
  const toggleTaskFilter = () => {
    if (!showMyTasks) {
      setFilteredTasks(tasks.filter(task => task.assigned_to === userInfo.employee_id));
    } else {
      setFilteredTasks(tasks);
    }
    setShowMyTasks(!showMyTasks);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks List</Text>

      {/* ✅ Filtering Button */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleTaskFilter}>
        <Text style={styles.filterButtonText}>
          {showMyTasks ? "Show All Tasks" : "Show My Tasks"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.task_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetails(item)}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Assigned To: {item.assigned_to || 'Unassigned'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {(userInfo && (userInfo.role_id === 1 || userInfo.role_id === 2)) && (
        <Button title="Add New Task" onPress={navigateToCreate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  filterButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "right",
    
  },
  filterButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemTitle: { fontWeight: 'bold', fontSize: 18 },
});

export default TasksScreen;
