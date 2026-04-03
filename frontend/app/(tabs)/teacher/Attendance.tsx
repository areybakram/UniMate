import { StyleSheet, Text, View } from 'react-native';

export default function AttendancePlaceholder() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Attendance Management Coming Soon 📅</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    text: { fontSize: 18, color: '#6B7280', fontWeight: '500' }
});
