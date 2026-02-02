import { Armchair, MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type TicketResult = 'WIN' | 'LOSE' | 'DRAW';

export interface TicketCardProps {
    date: string; // ISO string or formatted MM.DD
    day: string; // e.g. "Sat"
    matchup: string; // e.g. "Hanwha vs LG"
    result: TicketResult;
    score: string;
    stadium: string;
    seat: string;
    teamColor?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
    date,
    day,
    matchup,
    result,
    score,
    stadium,
    seat,
    teamColor = '#F37321', // Default Hanwha Orange
}) => {
    // Parse date if needed, assuming formatted for now as per prompt "MM.DD"
    // If ISO is passed, we might want to format it. 
    // The prompt says "Left: Date (MM.DD), Day".
    // I will accept pre-formatted or format it here.
    // For simplicity, let's assume the prop `date` passed is already "MM.DD" or I format it.
    // Let's assume the passed prop is "MM.DD" to keep component dumb, or standard Date string.
    // Prompt says: "Data: Fetch from Firestore...".
    // let's stick to formatted props for display.

    const getResultColor = (res: TicketResult) => {
        switch (res) {
            case 'WIN': return '#D32F2F'; // Red for Win (KBO style - usually Win is red/prominent)
            case 'LOSE': return '#1976D2'; // Blue for Lose
            case 'DRAW': return '#757575';
            default: return '#000';
        }
    };

    const resultColor = getResultColor(result);

    return (
        <View style={styles.container}>
            {/* Left Section: Date */}
            <View style={styles.leftSection}>
                <Text style={[styles.dateText, { color: teamColor }]}>{date}</Text>
                <Text style={styles.dayText}>{day}</Text>
            </View>

            {/* Middle: Dashed Line */}
            <View style={styles.dividerContainer}>
                <View style={styles.circleTop} />
                <View style={styles.dashedLine}>
                    {/* Dashed line via border */}
                    <View style={styles.dash} />
                </View>
                <View style={styles.circleBottom} />
            </View>

            {/* Right Section: Match Info */}
            <View style={styles.rightSection}>
                <View style={styles.headerRow}>
                    <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
                        <Text style={styles.resultText}>{result}</Text>
                    </View>
                    <Text style={styles.scoreText}>{score}</Text>
                </View>

                <Text style={styles.matchupText}>{matchup}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.iconRow}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.infoText}>{stadium}</Text>
                    </View>
                    <View style={[styles.iconRow, { marginLeft: 12 }]}>
                        <Armchair size={14} color="#666" />
                        <Text style={styles.infoText}>{seat}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 20,
        marginVertical: 10,
        height: 140,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden', // for circles to look like cutouts if needed, but here we place them on top or standard white bg
    },
    leftSection: {
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRightWidth: 0,
    },
    dateText: {
        fontSize: 24,
        fontWeight: '800',
    },
    dayText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
        marginTop: 4,
    },
    dividerContainer: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    dashedLine: {
        height: '80%',
        width: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    dash: {
        // trick for dashed line in RN if borderStyle doesn't work perfectly on all views, 
        // but usually borderStyle: 'dashed' on View works.
        // Alternatively use SVG.
    },
    circleTop: {
        position: 'absolute',
        top: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f2f2f2', // Match background color of screen
    },
    circleBottom: {
        position: 'absolute',
        bottom: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
    },
    rightSection: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resultBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    resultText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    matchupText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});

export default TicketCard;
