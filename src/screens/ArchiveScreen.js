import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-paper";
import { fetchArchivedDocuments, fetchArchivedEquipment, fetchArchivedTasks, fetchArchivedSuppliers, fetchArchivedEmployees } from "../api/api";

const ArchiveScreen = () => {
  const [archiveType, setArchiveType] = useState("documents");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      let response = [];
      switch (archiveType) {
        case "documents":
          response = await fetchArchivedDocuments();
          break;
        case "equipment":
          response = await fetchArchivedEquipment();
          break;
        case "tasks":
          response = await fetchArchivedTasks();
          break;
        case "suppliers":
          response = await fetchArchivedSuppliers();
          break;
        case "employees":
          response = await fetchArchivedEmployees();
          break;
        default:
          response = [];
      }
  
      console.log("📡 API Response:", response);
  
      // Ensure it's a valid array
      if (!Array.isArray(response)) {
        console.error("❌ API did not return an array:", response);
        setData([]); // Prevent crash
      } else {
        setData(response);
      }
    } catch (error) {
      console.error("Error fetching archives:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchArchives();
  }, [archiveType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archived Items</Text>

      {/* Dropdown for selecting archive type */}
      <Picker
        selectedValue={archiveType}
        onValueChange={(itemValue) => setArchiveType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Documents" value="documents" />
        <Picker.Item label="Equipment" value="equipment" />
        <Picker.Item label="Tasks" value="tasks" />
        <Picker.Item label="Suppliers" value="suppliers" />
        <Picker.Item label="Employees" value="employees" />
      </Picker>

      {/* Loading Indicator */}
      {loading ? <ActivityIndicator size="large" color="#007bff" /> : null}

      {/* Archived Items List */}
      <FlatList
  data={data}
  keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())} // Avoid undefined errors
  renderItem={({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{item.name || item.title || "Unnamed Item"}</Text>
      <Text style={styles.cardText}>{JSON.stringify(item, null, 2)}</Text>
    </Card>
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
  },
});

export default ArchiveScreen;
