import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalPlace = {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  placeType?: string;
};

const STORAGE_KEY = '@places_local';

export async function getLocalPlaces(): Promise<LocalPlace[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load places from storage", e);
    return [];
  }
}

export async function saveLocalPlace(place: Omit<LocalPlace, 'id'>): Promise<LocalPlace> {
  try {
    const places = await getLocalPlaces();
    const newPlace: LocalPlace = {
      ...place,
      id: Date.now().toString(), // Simple ID generation
    };
    const updatedPlaces = [...places, newPlace];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
    return newPlace;
  } catch (e) {
    console.error("Failed to save place to storage", e);
    throw e;
  }
}

export async function clearLocalPlaces(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch(e) {
        console.error("Failed to clear places", e);
    }
}
