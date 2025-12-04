import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { RoadBook } from "@/model/RaodBook";

// ---- Helper: format dates as DD/MM/YYYY ----
const formatDate = (date: Date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
};

type RoadBookCardProps = {
    roadBook: RoadBook;
};

export function RoadBookCard({ roadBook }: RoadBookCardProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Cover image */}
            <Image
                source={{ uri: roadBook.coverImageURL }}
                style={styles.cover}
            />

            {/* Title */}
            <Text style={styles.title}>{roadBook.title}</Text>

            {/* Description */}
            <Text style={styles.description}>{roadBook.description}</Text>

            {/* Dates */}
            {roadBook.startDate && roadBook.endDate ? (
                <View style={styles.section}>
                    <Text style={styles.label}>Dates</Text>
                    <Text style={styles.value}>
                        {formatDate(roadBook.startDate)} → {formatDate(roadBook.endDate)}
                    </Text>
                </View>
            ) : null}

            {/* Countries */}
            <View style={styles.section}>
                <Text style={styles.label}>Countries</Text>
                <Text style={styles.value}>{roadBook.countries.join(", ")}</Text>
            </View>

            {/* Tags */}
            <View style={styles.section}>
                <Text style={styles.label}>Tags</Text>
                <Text style={styles.value}>{roadBook.tags.join(", ")}</Text>
            </View>

            {/* Themes */}
            <View style={styles.section}>
                <Text style={styles.label}>Themes</Text>
                <Text style={styles.value}>
                    {Array.isArray(roadBook.theme)
                        ? roadBook.theme.join(", ")
                        : roadBook.theme || ""}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.section}>
                <Text style={styles.label}>Statistics</Text>
                <Text style={styles.value}>Views: {roadBook.viewCount}</Text>
                <Text style={styles.value}>Favorites: {roadBook.favoriteCount}</Text>
            </View>

            {/* Places */}
            <View style={styles.section}>
                <Text style={styles.label}>Places</Text>
                {roadBook.places.length === 0 ? (
                    <Text style={styles.value}>No places added yet.</Text>
                ) : (
                    roadBook.places.map((place, index) => (
                        <View key={index} style={styles.placeCard}>
                            <Text style={styles.placeName}>{place.name}</Text>
                            <Text style={styles.placeDesc}>{place.description}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        alignItems: "center",
        backgroundColor: "#fafafa",
    },
    cover: {
        width: "100%",
        height: 230,
        borderRadius: 14,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#555",
        width: "100%",
        marginBottom: 16,
    },
    section: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        color: "#333",
    },
    placeCard: {
        padding: 10,
        marginTop: 6,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    placeName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    placeDesc: {
        fontSize: 14,
        color: "#555",
    },
});

export default RoadBookCard
