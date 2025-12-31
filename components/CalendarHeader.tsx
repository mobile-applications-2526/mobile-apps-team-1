import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarHeaderProps {
    currentDate: Date | null;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday?: () => void;
}

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity style={styles.iconButton} onPress={onPrevMonth}>
                    <AntDesign name="left" size={20} color="#4B5563" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {currentDate ? currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'Calendar'}
                </Text>
                <TouchableOpacity style={styles.iconButton} onPress={onNextMonth}>
                    <AntDesign name="right" size={20} color="#4B5563" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.todayButton} onPress={onToday}>
                <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    iconButton: {
        padding: 4,
        borderRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    todayButton: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    todayButtonText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '500',
    },
});
