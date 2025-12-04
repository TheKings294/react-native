import {View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useState} from "react";
import { useLanguage } from "@/providers/LanguageProvider";

function FormNewRoadBook() {
    const { t } = useLanguage();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const [showDatePicker, setShowDatePicker] = useState<
        null | "start" | "end"
    >(null);

    const [countries, setCountries] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [countryInput, setCountryInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    const [isPublished, setIsPublished] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    const [template, setTemplate] = useState("SIMPLE");
    const [theme, setTheme] = useState("default");

    const onSubmit = () => {
        const data = {
            title,
            description,
            coverImage,
            startDate,
            endDate,
            countries,
            tags,
            isPublished,
            isPublic,
            template,
            theme,
        };

        console.log("Roadbook created:", data);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{t("add.formTitle")}</Text>

            {/* Title */}
            <Text style={styles.label}>{t("add.titleLabel")}</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t("add.titlePlaceholder")}
            />

            {/* Description */}
            <Text style={styles.label}>{t("add.descriptionLabel")}</Text>
            <TextInput
                style={[styles.input, styles.bioInput]}
                value={description}
                onChangeText={setDescription}
                placeholder={t("add.descriptionPlaceholder")}
                multiline
            />

            {/* Cover Image */}
            <Text style={styles.label}>{t("add.coverLabel")}</Text>
            <TextInput
                style={styles.input}
                value={coverImage}
                onChangeText={setCoverImage}
                placeholder="https://example.com/image.jpg"
            />

            {/* Dates */}
            <Text style={styles.label}>{t("add.startDateLabel")}</Text>
            <Pressable
                onPress={() => setShowDatePicker("start")}
                style={styles.input}
            >
                <Text>
                    {startDate ? startDate.toDateString() : t("add.pickStart")}
                </Text>
            </Pressable>

            <Text style={styles.label}>{t("add.endDateLabel")}</Text>
            <Pressable onPress={() => setShowDatePicker("end")} style={styles.input}>
                <Text>{endDate ? endDate.toDateString() : t("add.pickEnd")}</Text>
            </Pressable>

            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    onChange={(e, date) => {
                        setShowDatePicker(null);
                        if (!date) return;
                        if (showDatePicker === "start") setStartDate(date);
                        if (showDatePicker === "end") setEndDate(date);
                    }}
                />
            )}

            {/* Countries */}
            <Text style={styles.label}>{t("add.countriesLabel")}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={countryInput}
                    onChangeText={setCountryInput}
                    placeholder="France..."
                />
                <Pressable
                    onPress={() => {
                        if (countryInput.trim() === "") return;
                        setCountries([...countries, countryInput.trim()]);
                        setCountryInput("");
                    }}
                    style={[styles.saveButton, { paddingHorizontal: 12 }]}
                >
                    <Text style={styles.saveText}>{t("add.add")}</Text>
                </Pressable>
            </View>

            {/* Chips */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                {countries.map((c, i) => (
                    <Pressable
                        key={i}
                        style={styles.chip}
                        onPress={() =>
                            setCountries(countries.filter((x) => x !== c))
                        }
                    >
                        <Text style={styles.chipText}>{c} ✕</Text>
                    </Pressable>
                ))}
            </View>

            {/* Tags */}
            <Text style={styles.label}>{t("add.tagsLabel")}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={tagInput}
                    onChangeText={setTagInput}
                    placeholder="Adventure..."
                />
                <Pressable
                    onPress={() => {
                        if (tagInput.trim() === "") return;
                        setTags([...tags, tagInput.trim()]);
                        setTagInput("");
                    }}
                    style={[styles.saveButton, { paddingHorizontal: 12 }]}
                >
                    <Text style={styles.saveText}>{t("add.add")}</Text>
                </Pressable>
            </View>

            {/* Chips */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                {tags.map((t, i) => (
                    <Pressable
                        key={i}
                        style={styles.chip}
                        onPress={() => setTags(tags.filter((x) => x !== t))}
                    >
                        <Text style={styles.chipText}>{t} ✕</Text>
                    </Pressable>
                ))}
            </View>

            {/* Booleans */}
            <Text style={styles.label}>{t("add.publishedLabel")}</Text>
            <Pressable
                onPress={() => setIsPublished(!isPublished)}
                style={styles.input}
            >
                <Text>{isPublished ? t("add.yes") : t("add.no")}</Text>
            </Pressable>

            <Text style={styles.label}>{t("add.publicLabel")}</Text>
            <Pressable onPress={() => setIsPublic(!isPublic)} style={styles.input}>
                <Text>{isPublic ? t("add.yes") : t("add.no")}</Text>
            </Pressable>

            {/* Template */}
            <Text style={styles.label}>{t("add.templateLabel")}</Text>
            <TextInput
                style={styles.input}
                value={template}
                onChangeText={setTemplate}
            />

            {/* Theme */}
            <Text style={styles.label}>{t("add.themeLabel")}</Text>
            <TextInput style={styles.input} value={theme} onChangeText={setTheme} />

            {/* Submit */}
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveText}>{t("add.submit")}</Text>
            </Pressable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },

    title: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 16,
    },

    label: {
        fontSize: 13,
        fontWeight: "700",
        marginTop: 12,
    },

    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        marginTop: 6,
    },

    bioInput: {
        minHeight: 90,
        textAlignVertical: "top",
    },

    saveButton: {
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#ddd",
        alignItems: "center",
    },

    saveText: {
        fontWeight: "800",
        fontSize: 16,
        color: "black",
    },

    chip: {
        backgroundColor: "#eee",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 6,
        marginBottom: 6,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
    },
});


export default FormNewRoadBook;
