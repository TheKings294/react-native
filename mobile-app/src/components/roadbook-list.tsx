import {Text, Image, StyleSheet, ScrollView, Pressable} from "react-native";
import {RoadBook} from "@/model/RaodBook";
import {useRouter} from "expo-router";

type RoadBookListProps = {
    listRoadBook: RoadBook[];
};

function RoadBookList({ listRoadBook }: RoadBookListProps) {
    const routeur = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {listRoadBook.map((rb) => (
                <Pressable key={rb.id} style={styles.card} onPress={() =>
                    routeur.push(`/roadbook?data=${encodeURIComponent(JSON.stringify(rb))}`)}>
                    <Image
                        source={{ uri: rb.coverImageURL }}
                        style={styles.cover}
                    />

                    <Text style={styles.title}>{rb.title}</Text>
                    <Text style={styles.description}>{rb.description}</Text>

                    <Text style={styles.label}>
                        Countries: <Text style={styles.value}>{rb.countries.join(", ")}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Tags: <Text style={styles.value}>{rb.tags.join(", ")}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Period:{" "}
                        <Text style={styles.value}>
                            {rb.startDate.toISOString().split("T")[0].split("-").reverse().join("/")} →
                            {rb.endDate.toISOString().split("T")[0].split("-").reverse().join("/")}
                        </Text>
                    </Text>

                    <Text style={styles.label}>
                        Views: <Text style={styles.value}>{rb.viewCount}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Favorites: <Text style={styles.value}>{rb.favoriteCount}</Text>
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        alignItems: "center",
    },
    card: {
        width: "95%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    cover: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
        color: "#444",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
    value: {
        fontWeight: "normal",
        color: "#333",
    },
});


export default RoadBookList;