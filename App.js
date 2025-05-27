import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import MedicinesScreen from './screens/MedicinesScreen';
import MedicineDetailScreen from './screens/MedicineDetailScreen';
import PastMedicinesScreen from './screens/PastMedicinesScreen'; 
import PlanScreen from './screens/PlanScreen';
import ProfileScreen from './screens/ProfileScreen';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { PlanProvider } from './context/PlanContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 62,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          position: 'absolute',
        },
        tabBarActiveTintColor: "#2C45C7",
        tabBarInactiveTintColor: "#A0A0A0",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Ilaçlar"
        component={MedicinesScreen}
        options={{
          title: "İlaçlar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar-alt" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PlanProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} />
          <Stack.Screen name="PastMedicines" component={PastMedicinesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlanProvider>
  );
}