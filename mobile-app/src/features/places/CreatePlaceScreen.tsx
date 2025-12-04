import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { saveLocalPlace } from "@/lib/placesStorage";
import * as Location from "expo-location";

export default function CreatePlaceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [placeType, setPlaceType] = useState("OTHER");

  // Suggestion State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  // Simplistic list of types matching the backend enum
  const PLACE_TYPES = [
    "RESTAURANT", "HOTEL", "ATTRACTION", "MUSEUM", "PARK", "BEACH", 
    "MOUNTAIN", "CITY", "VIEWPOINT", "HIDDEN_GEM", "CAFE", "BAR", 
    "SHOP", "TRANSPORTATION", "OTHER"
  ];

  const fetchSuggestions = async (query: string) => {
      if (query.length < 3) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
      }

      setSearching(true);
      try {
          // Using standard fetch with User-Agent
          const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
              {
                  headers: {
                      'User-Agent': 'SpotChat-MobileApp/1.0'
                  }
              }
          );
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
      } catch (error) {
          console.error("Suggestion fetch error:", error);
      } finally {
          setSearching(false);
      }
  };

  // Debounce Effect
  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
          if (name) {
              fetchSuggestions(name);
          }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
  }, [name]);

  const handleSelectSuggestion = (item: any) => {
      setName(item.name || item.display_name.split(',')[0]); // Try to get a short name
      setLatitude(item.lat);
      setLongitude(item.lon);
      
      if (item.address) {
          setCity(item.address.city || item.address.town || item.address.village || "");
          setCountry(item.address.country || "");
      }

      setShowSuggestions(false);
      // Close keyboard
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Nous avons besoin de votre permission pour accéder à la localisation.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());

      // Reverse geocode to get city/country
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        if (address.city) setCity(address.city);
        if (address.country) setCountry(address.country);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer votre position.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleGeocodeAddress = async () => {
    if (!city && !country) {
        // Silent return if empty
        return;
    }
    
    setIsLocating(true);
    try {
        const query = `${city} ${country}`.trim();
        let geocode = await Location.geocodeAsync(query);

        if (geocode.length > 0) {
            setLatitude(geocode[0].latitude.toString());
            setLongitude(geocode[0].longitude.toString());
        } else {
            Alert.alert("Introuvable", "Impossible de trouver les coordonnées pour ce lieu.");
        }
    } catch (error) {
        Alert.alert("Erreur", "Erreur lors de la recherche de l'adresse.");
    } finally {
        setIsLocating(false);
    }
  };

  const handleCreate = async () => {
    if (!name || !latitude || !longitude || !country) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires (Nom, Latitude, Longitude, Pays).");
      return;
    }

    setIsLoading(true);
    try {
      await saveLocalPlace({
        name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        country,
        city,
        placeType,
      });
      Alert.alert("Succès", "Le lieu a été créé avec succès (localement) !", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Nouveau Lieu</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity 
            style={[styles.locationButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
            onPress={handleGetCurrentLocation}
            disabled={isLocating}
        >
            {isLocating ? (
                <ActivityIndicator color={colors.primary} size="small" />
            ) : (
                <>
                    <FontAwesome name="map-marker" size={18} color={colors.primary} style={{ marginRight: 10 }} />
                    <Text style={[styles.locationButtonText, { color: colors.primary }]}>Utiliser ma position actuelle</Text>
                </>
            )}
        </TouchableOpacity>

        <View style={[styles.formGroup, { zIndex: 10 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Nom du lieu *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}            placeholder="Ex: Tour Eiffel"
            placeholderTextColor={colors.text + '80'}
            value={name}
            onChangeText={(text) => {
                setName(text);
                if (text.length === 0) setShowSuggestions(false);
            }}
            onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
            }}
          />
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
              <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {searching && (
                      <ActivityIndicator size="small" color={colors.primary} style={{ margin: 10 }} />
                  )}
                  {suggestions.map((item, index) => (
                      <TouchableOpacity 
                          key={item.place_id || index} 
                          style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                          onPress={() => handleSelectSuggestion(item)}
                      >
                          <Text style={[styles.suggestionText, { color: colors.text }]}>{item.display_name}</Text>
                      </TouchableOpacity>
                  ))}
              </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}            placeholder="Description du lieu..."
            placeholderTextColor={colors.text + '80'}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Address Section with Geocoding */}
        <View style={styles.row}>
             <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Ville</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}                    placeholder="Ex: Paris"
                    placeholderTextColor={colors.text + '80'}
                    value={city}
                    onChangeText={setCity}
                    onBlur={handleGeocodeAddress}
                />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Pays *</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}                    placeholder="Ex: France"
                    placeholderTextColor={colors.text + '80'}
                    value={country}
                    onChangeText={setCountry}
                    onBlur={handleGeocodeAddress}
                />
            </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Latitude *</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card + '80', opacity: 0.7 }]}              placeholder="Lat"
              placeholderTextColor={colors.text + '80'}
              keyboardType="numeric"
              value={latitude}
              editable={false}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Longitude *</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card + '80', opacity: 0.7 }]}              placeholder="Long"
              placeholderTextColor={colors.text + '80'}
              keyboardType="numeric"
              value={longitude}
              editable={false}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Type de lieu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {PLACE_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.typeButton,
                            placeType === type ? { backgroundColor: colors.primary } : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }
                        ]}
                        onPress={() => setPlaceType(type)}
                    >
                        <Text style={[
                            styles.typeText,
                            placeType === type ? { color: '#fff' } : { color: colors.text }
                        ]}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Créer le lieu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  backButton: { padding: 5 },
  title: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { marginBottom: 8, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  typeScroll: { flexDirection: 'row', paddingVertical: 5 },
  typeButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
  },
  typeText: { fontSize: 14, fontWeight: "600" },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  locationButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80, // Just below the input
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 1000, // Ensure it's above other elements
    elevation: 5, // For Android shadow
  },
  suggestionItem: {
      padding: 12,
      borderBottomWidth: 0.5,
  },
  suggestionText: {
      fontSize: 14,
  }
});
