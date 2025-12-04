import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/context/AuthContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { t } = useLanguage();
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#D8EBC9",
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          position: "absolute",
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
          title: t("tabs.library"),
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#9BC588",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
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
          title: t("tabs.map"),
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
    </Tabs>
  );
}
