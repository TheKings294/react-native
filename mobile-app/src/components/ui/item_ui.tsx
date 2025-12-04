import {useTheme} from "@react-navigation/native";
import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";

type ItemProps = {
    label: string;
    description?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
};

export const Item = ({ label, description, onPress, right, danger }: ItemProps) => {
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.item,
                { backgroundColor: danger ? "#fff1f2" : colors.card },
                pressed && onPress && styles.itemPressed,
            ]}
            accessibilityRole={onPress ? "button" : "none"}
        >
            <View style={styles.itemLeft}>
                <Text
                    style={[
                        styles.itemLabel,
                        { color: danger ? "#b91c1c" : colors.text },
                    ]}
                >
                    {label}
                </Text>

                {!!description && (
                    <Text
                        style={[
                            styles.itemDescription,
                            { color: colors.text, opacity: 0.6 },
                        ]}
                    >
                        {description}
                    </Text>
                )}
            </View>

            <View style={styles.itemRight}>
                {right ? (
                    right
                ) : onPress ? (
                    <Text style={[styles.chevron, { color: colors.text, opacity: 0.5 }]}>
                        ›
                    </Text>
                ) : null}
            </View>
        </Pressable>
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