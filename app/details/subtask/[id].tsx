import ScreenHeader from "@/components/ScreenHeader";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SubtaskDetailScreen() {
const { id } = useLocalSearchParams<{ id: string }>();

return (
    <View style={styles.container}>
        <ScreenHeader title="Subtask" />

        <View style={styles.card}>
            <Text style={styles.text}>
                Subtask detail screen{"\n\n"}
                Completion, description and work sessions live here.
            </Text>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
},
card: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
},
text: {
    color: "#4B5563",
    lineHeight: 22,
},
});
