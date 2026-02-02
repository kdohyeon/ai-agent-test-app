import { StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Dashboard</Text>
            <Text>Welcome to the KBO Ticket Book Admin Panel.</Text>
            <View style={styles.statsContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Total Users</Text>
                    <Text style={styles.cardValue}>-</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Total Records</Text>
                    <Text style={styles.cardValue}>-</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
    card: {
        width: 200,
        height: 100,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 20,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    }
});
