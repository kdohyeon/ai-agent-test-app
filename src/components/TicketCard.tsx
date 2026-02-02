import { Armchair, MapPin, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TicketResult = 'WIN' | 'LOSE' | 'DRAW' | 'SCHEDULED';

export interface TicketCardProps {
    date: string; // ISO string or formatted MM.DD
    day: string; // e.g. "Sat"
    matchup: string; // e.g. "Hanwha vs LG"
    result: TicketResult;
    score: string;
    stadium: string;
    seat: string;
    teamColor?: string;
    onDelete?: () => void;
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
    onDelete,
}) => {
    // Parse formatted date string "yyyy-MM-dd (Day)" -> ["yyyy", "MM", "dd", "Day"]
    // Expected format from new logic: "2024-04-02 (Tue)"
    // If legacy format "MM.DD", handle gracefully or assume migration.
    // Let's hold logic to parse basic parts.

    let year = '', month = '', dayNum = '', weekday = '';

    if (date.includes('-') && date.includes('(')) {
        // "2024-04-02 (Tue)"
        const parts = date.split(' '); // ["2024-04-02", "(Tue)"]
        const dateParts = parts[0].split('-'); // ["2024", "04", "02"]
        year = dateParts[0];
        month = dateParts[1];
        dayNum = dateParts[2];
        weekday = parts[1].replace(/[()]/g, ''); // "Tue"
    } else if (date.includes('.')) {
        // Legacy "MM.DD" - Assuming current year or handled elsewhere, but prompts asked to split lines.
        // Let's just try to split by dot.
        const parts = date.split('.');
        if (parts.length >= 2) {
            month = parts[0];
            dayNum = parts[1];
            weekday = day; // Use day prop for weekday
        }
    } else {
        // Fallback
        month = '??';
        dayNum = '??';
        weekday = day;
    }

    const startYear = new Date().getFullYear().toString(); // Fallback if needed, but we rely on year grouping in parent.

    const getResultColor = (res: TicketResult) => {
        switch (res) {
            case 'WIN': return '#D32F2F';
            case 'LOSE': return '#1976D2';
            case 'DRAW': return '#757575';
            case 'SCHEDULED': return '#BBBBBB'; // Gray for scheduled
            default: return '#000';
        }
    };

    const getResultText = (res: TicketResult) => {
        switch (res) {
            case 'WIN': return 'WIN';
            case 'LOSE': return 'LOSE';
            case 'DRAW': return 'DRAW'; // Requested "DRAW" if equal, or "무승부"? Prompt said "DRAW로 표현해줘"
            case 'SCHEDULED': return '예정';
            default: return res;
        }
    };

    const resultColor = getResultColor(result);
    const resultText = getResultText(result);

    return (
        <View style={styles.container}>
            {/* Left Section: Date */}
            <View style={styles.leftSection}>
                <Text style={[styles.monthText, { color: teamColor }]}>{month}</Text>
                <Text style={styles.dayNumText}>{dayNum}</Text>
                <Text style={styles.weekdayText}>{weekday}</Text>
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
                        <Text style={styles.resultText}>{resultText}</Text>
                    </View>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreText}>{score}</Text>
                        {onDelete && (
                            <TouchableOpacity onPress={onDelete} hitSlop={8}>
                                <Trash2 size={16} color="#999" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        )}
                    </View>
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
        width: 100, // Slightly wider for 3 lines if needed
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRightWidth: 0,
    },
    monthText: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: -4, // Tighten spacing
    },
    dayNumText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    weekdayText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
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
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
