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
      </Stack.Navigator>
    </NavigationContainer>
  );
}