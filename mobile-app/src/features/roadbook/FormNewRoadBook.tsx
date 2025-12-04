import {View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useState} from "react";
import { Picker } from '@react-native-picker/picker';
import {createRoadBook, CreateRoadBookPayload} from "@/lib/api";

function FormNewRoadBook() {
    type TemplateType =
        | 'SIMPLE'
        | 'TRAVEL_DIARY'
        | 'PHOTO_ALBUM'
        | 'MAGAZINE'
        | 'MINIMALIST'
        | 'CLASSIC';

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

    const [template, setTemplate] = useState<TemplateType>('SIMPLE');
    const [theme, setTheme] = useState("default");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async () => {
        const data: CreateRoadBookPayload = {
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

        try {
            const response = await createRoadBook(data)

            console.log(response)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Une erreur s'est produite.";
            setError(message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Create Roadbook</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Roadtrip in Italy..."
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.bioInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Short description..."
                multiline
            />

            {/* Cover Image */}
            <Text style={styles.label}>Cover Image URL</Text>
            <TextInput
                style={styles.input}
                value={coverImage}
                onChangeText={setCoverImage}
                placeholder="https://example.com/image.jpg"
            />

            {/* Dates */}
            <Text style={styles.label}>Start Date</Text>
            <Pressable
                onPress={() => setShowDatePicker("start")}
                style={styles.input}
            >
                <Text>
                    {startDate ? startDate.toDateString() : "Pick a start date"}
                </Text>
            </Pressable>

            <Text style={styles.label}>End Date</Text>
            <Pressable onPress={() => setShowDatePicker("end")} style={styles.input}>
                <Text>{endDate ? endDate.toDateString() : "Pick an end date"}</Text>
            </Pressable>

            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    textColor="black"
                    onChange={(e, date) => {
                        setShowDatePicker(null);
                        if (!date) return;
                        if (showDatePicker === "start") setStartDate(date);
                        if (showDatePicker === "end") setEndDate(date);
                    }}
                />
            )}

            {/* Countries */}
            <Text style={styles.label}>Countries</Text>
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
                    <Text style={styles.saveText}>Add</Text>
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
            <Text style={styles.label}>Tags</Text>
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
                    <Text style={styles.saveText}>Add</Text>
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
            <Text style={styles.label}>Is Published</Text>
            <Pressable
                onPress={() => setIsPublished(!isPublished)}
                style={styles.input}
            >
                <Text>{isPublished ? "Yes" : "No"}</Text>
            </Pressable>

            <Text style={styles.label}>Is Public</Text>
            <Pressable onPress={() => setIsPublic(!isPublic)} style={styles.input}>
                <Text>{isPublic ? "Yes" : "No"}</Text>
            </Pressable>

            {/* Template */}
            <Text style={styles.label}>Template</Text>
            <Picker
                selectedValue={template}
                onValueChange={(itemValue) => setTemplate(itemValue)}
                style={[styles.input, { color: 'black' }]}
                dropdownIconColor="black"
            >
                <Picker.Item label="Simple" value="SIMPLE" color={"black"} />
                <Picker.Item label="Travel Diary" value="TRAVEL_DIARY" color={"black"} />
                <Picker.Item label="Photo Album" value="PHOTO_ALBUM" color={"black"} />
                <Picker.Item label="Magazine" value="MAGAZINE" color={"black"} />
                <Picker.Item label="Minimalist" value="MINIMALIST" color={"black"} />
                <Picker.Item label="Classic" value="CLASSIC" color={"black"} />
            </Picker>

            {/* Theme */}
            <Text style={styles.label}>Theme</Text>
            <TextInput style={styles.input} value={theme} onChangeText={setTheme} />

            {/* Submit */}
            <Pressable style={styles.saveButton} onPress={onSubmit}>
                <Text style={styles.saveText}>Create Roadbook</Text>
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
    error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});


export default FormNewRoadBook;