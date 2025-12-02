import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#D8EBC9',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: '#9BC588',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <FontAwesome name="plus" size={30} color="black" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Ma carte',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
    </Tabs>
  );
}
