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
            {listRoadBook.map((rb, index) => {
                const countries = Array.isArray(rb.countries) ? rb.countries : [];
                const tags = Array.isArray(rb.tags) ? rb.tags : [];
                const startDate = rb.startDate ? new Date(rb.startDate) : null;
                const endDate = rb.endDate ? new Date(rb.endDate) : null;
                const cover = rb.coverImageURL || rb.coverImage || '';
                return (
                    <Pressable
                        key={rb.id ?? `rb-${index}`}
                        style={styles.card}
                        onPress={() =>
                            routeur.push(`/roadbook?data=${encodeURIComponent(JSON.stringify(rb))}`)
                        }>
                        {cover ? (
                            <Image
                                source={{ uri: cover }}
                                style={styles.cover}
                            />
                        ) : null}

                        <Text style={styles.title}>{rb.title}</Text>
                        <Text style={styles.description}>{rb.description}</Text>

                        <Text style={styles.label}>
                            Countries: <Text style={styles.value}>{countries.join(", ")}</Text>
                        </Text>

                        <Text style={styles.label}>
                            Tags: <Text style={styles.value}>{tags.join(", ")}</Text>
                        </Text>

                        {startDate && endDate ? (
                            <Text style={styles.label}>
                                Period:{" "}
                                <Text style={styles.value}>
                                    {startDate.toISOString().split("T")[0].split("-").reverse().join("/")} →
                                    {endDate.toISOString().split("T")[0].split("-").reverse().join("/")}
                                </Text>
                            </Text>
                        ) : null}

                        <Text style={styles.label}>
                            Views: <Text style={styles.value}>{rb.viewCount ?? 0}</Text>
                        </Text>

                        <Text style={styles.label}>
                            Favorites: <Text style={styles.value}>{rb.favoriteCount ?? 0}</Text>
                        </Text>
                    </Pressable>
                );
            })}
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
