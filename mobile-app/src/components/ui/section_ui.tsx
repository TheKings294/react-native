import React from "react";
import {useTheme} from "@react-navigation/native";
import {StyleSheet, Text, View} from "react-native";

export const Section = ({
                     title,
                     children,
                 }: {
    title: string;
    children: React.ReactNode;
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, opacity: 0.6 }]}>
                {title}
            </Text>

            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },

    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 12,
    },

    section: { marginTop: 14 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.7,
    },
    sectionCard: {
        borderRadius: 16,
        paddingVertical: 4,
    },

    item: {
        minHeight: 56,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        marginHorizontal: 6,
        marginVertical: 4,
    },
    itemPressed: { opacity: 0.65 },

    itemLeft: { flex: 1, paddingRight: 8 },
    itemLabel: { fontSize: 16, fontWeight: "600" },
    itemDescription: { fontSize: 13, marginTop: 2 },

    itemRight: { justifyContent: "center", alignItems: "center" },
    chevron: { fontSize: 22, marginLeft: 8 },
});