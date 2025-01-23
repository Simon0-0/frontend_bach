import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEmployees } from '../api/api';

const EmployeesScreen = ({ navigation }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Get auth token
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }

                // Decode JWT token (extract user info)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.data.role_id);

                // Redirect unauthorized users
                if (payload.data.role_id > 2) {
                    Alert.alert("Access Denied", "You are not authorized to view this page.");
                    navigation.navigate('Dashboard');
                    return;
                }

                // Fetch employees list
                const data = await fetchEmployees();
                setEmployees(data);
            } catch (err) {
                setError('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Employees List</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <FlatList
                        data={employees}
                        keyExtractor={(item) => item.employee_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('EmployeeDetails', { employeeId: item.employee_id })}>
                                <View style={styles.employeeCard}>
                                    <Text style={styles.employeeName}>{item.name}</Text>
                                    <Text>Email: {item.email}</Text>
                                    <Text>Phone: {item.phone}</Text>
                                    <Text>Position: {item.position}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}

                {/* ✅ Show "Create Employee" Button for Admins (role_id 1) */}
                {userRole === 1 && (
                    <Button title="Create Employee" onPress={() => navigation.navigate('CreateEmployee')} color="green" />
                )}

                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 620, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    error: { fontSize: 18, color: 'red' },
    employeeCard: {
        width: '100%',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    employeeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});

export default EmployeesScreen;
