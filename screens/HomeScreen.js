import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Card from "../components/Card";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StepperForm from "./StepperForm";
import { firebaseApp, firestore } from "../firebaseConfig";
import { doc, getDocs, collection,query,where } from "@firebase/firestore";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AllScreen = ({ navigation }) => {
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(firestore, "springs");
        const querySnapshot = await getDocs(collectionRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormData(data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {formData.map((data) => (
        <Card
          id={data.id}
          springName={data.springName}
          name={data.name}
          date={data.createdDate}
          time={data.createdTime}
          status={data.status}
          onEdit={(id) => navigation.navigate("StepperForm", { id })}
        />
      ))}
    </ScrollView>
  );
};

const PendingScreen = ({ navigation }) => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(firestore, "springs");
        const q = query(collectionRef, where("status", "==", "Pending"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormData(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
    {formData.map((data) => (
        <Card
          id={data.id}
          springName={data.springName}
          name={data.name}
          date={data.createdDate}
          time={data.createdTime}
          status={data.status}
          onEdit={(id) => navigation.navigate("StepperForm", { id })}
        />
      ))}
    </ScrollView>
  );
};

const SubmittedScreen = () => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(firestore, "springs");
        const q = query(collectionRef, where("status", "==", "Submitted"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormData(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
    {formData.map((data) => (
        <Card
          id={data.id}
          springName={data.springName}
          name={data.name}
          date={data.createdDate}
          time={data.createdTime}
          status={data.status}
          onEdit={(id) => navigation.navigate("StepperForm", { id })}
        />
      ))}
    </ScrollView>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarStyle: { backgroundColor: "#6a1b9a" },
      }}
    >
      <Tab.Screen
        name="All"
        component={AllScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Pending"
        component={PendingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Submitted"
        component={SubmittedScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spring Survey</Text>
      </View>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StepperForm"
          component={StepperForm}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("StepperForm", { id: null })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6a1b9a",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#6a1b9a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    bottom: 100,
    right: 20,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
