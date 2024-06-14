import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const Card = ({ id, springName, name, date, time, status, onEdit }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Spring Name:</Text>
        <Text style={styles.value}>{springName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{time}</Text>
      </View>
      <View style={styles.row}>
        <Button title="Upload" color="#6a1b9a" onPress={() => {}} />
        <Button title="Edit" color="#6a1b9a" onPress={() => onEdit(id)} />
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3e5f5",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#4a148c",
  },
  value: {
    color: "#4a148c",
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Card;
