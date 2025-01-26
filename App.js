import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';
import SuppliersScreen from './src/screens/SuppliersScreen';
import TasksScreen from './src/screens/TasksScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import EquipmentDetailsScreen from './src/screens/EquipmentDetailScreen';
import CreateEquipmentScreen from './src/screens/CreateEquipmentScreen';
import SupplierDetailsScreen from './src/screens/SupplierDetailsScreen';
import CreateSupplierScreen from './src/screens/CreateSuppliersScreen';
import UpdateSupplierScreen from './src/screens/SupplierUpdateScreen';
import UpdateEquipmentScreen from './src/screens/EquipmentUpdateScreen';
import UpdateTaskScreen from './src/screens/UpdateTaskScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import DocumentDetailScreen from './src/screens/DocumentDetailScreen';
import UpdateDocumentScreen from './src/screens/UpdateDocumentScreen';
import CreateDocumentScreen from './src/screens/CreateDocumentScreen';
import CreateEmployeeScreen from './src/screens/CreateEmployeeScreen';
import EmployeeDetailsScreen from './src/screens/EmployeeDetailsScreen';
import UpdateEmployeeScreen from './src/screens/UpdateEmployeeScreen';
import Employees from './src/screens/EmployeesScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MenuDrawer = () => (
  <Drawer.Navigator initialRouteName="Dashboard">
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Equipment" component={EquipmentScreen} />
    <Drawer.Screen name="Suppliers" component={SuppliersScreen} />
    <Drawer.Screen name="Tasks" component={TasksScreen} />
    <Drawer.Screen name="Documents" component={DocumentsScreen} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="Equipment" component={EquipmentScreen} />
        <Stack.Screen name="EquipmentDetails" component={EquipmentDetailsScreen} />
        <Stack.Screen name="CreateEquipment" component={CreateEquipmentScreen} />
        <Stack.Screen name="Suppliers" component={SuppliersScreen} />
        <Stack.Screen name="SupplierDetails" component={SupplierDetailsScreen} />
        <Stack.Screen name="CreateSupplier" component={CreateSupplierScreen} />
        <Stack.Screen name="UpdateSupplier" component={UpdateSupplierScreen} />
        <Stack.Screen name="UpdateEquipment" component={UpdateEquipmentScreen} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
        <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
        <Stack.Screen name="DocumentDetails" component={DocumentDetailScreen} />
        <Stack.Screen name="UpdateDocument" component={UpdateDocumentScreen} />
        <Stack.Screen name="CreateDocument" component={CreateDocumentScreen} />
        <Stack.Screen name="CreateEmployee" component={CreateEmployeeScreen} />
        <Stack.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} />
        <Stack.Screen name="UpdateEmployee" component={UpdateEmployeeScreen} />
        <Stack.Screen name="Employees" component={Employees} />
        <Stack.Screen name='ChangePassword' component={ChangePasswordScreen}/>
        <Stack.Screen name='Archive' component={ArchiveScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
