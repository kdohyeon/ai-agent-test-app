import { TEAMS } from '@/constants/teams';
import { useTheme } from '@/context/ThemeContext';
import { db } from '@/src/config/firebase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Game {
    id: string;
    date: string; // YYYY-MM-DD
    time: string;
    homeTeamId: string;
    awayTeamId: string;
    stadium: string;
    homeScore?: number;
    awayScore?: number;
    status: 'scheduled' | 'playing' | 'finished' | 'canceled';
}

export default function ScheduleScreen() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const { selectedTeam } = useTheme();

    const primaryColor = selectedTeam?.primaryColor || '#000';

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        setLoading(true);
        try {
            // Firestore index fix: Only sort by date in query, sort by time in client
            const q = query(collection(db, 'games'), orderBy('date', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedGames: Game[] = [];
            querySnapshot.forEach((doc) => {
                fetchedGames.push({ id: doc.id, ...doc.data() } as Game);
            });

            // Client-side sort: primarily by date, secondarily by time
            fetchedGames.sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return a.time.localeCompare(b.time);
            });

            setGames(fetchedGames);
        } catch (error) {
            console.error('Error fetching games: ', error);
            Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // Temporary function to seed data for testing
    const seedData = async () => {
        try {
            const dummyGames = [
                {
                    date: '2024-04-01',
                    time: '18:30',
                    homeTeamId: 'hanwha',
                    awayTeamId: 'lg',
                    stadium: '한화생명 이글스파크',
                    status: 'scheduled',
                },
                {
                    date: '2024-04-02',
                    time: '18:30',
                    homeTeamId: 'kia',
                    awayTeamId: 'lotte',
                    stadium: '광주-기아 챔피언스 필드',
                    status: 'scheduled',
                },
                {
                    date: '2024-04-02',
                    time: '18:30',
                    homeTeamId: 'samsung',
                    awayTeamId: 'kt',
                    stadium: '대구 삼성 라이온즈 파크',
                    status: 'scheduled',
                },
                {
                    date: '2024-03-31',
                    time: '14:00',
                    homeTeamId: 'kiwoom',
                    awayTeamId: 'doosan',
                    stadium: '고척 스카이돔',
                    status: 'finished',
                    homeScore: 4,
                    awayScore: 8,
                },
            ];

            for (const game of dummyGames) {
                await addDoc(collection(db, 'games'), game);
            }
            Alert.alert('성공', '테스트 데이터가 추가되었습니다.');
            fetchGames();
        } catch (e) {
            console.error(e);
            Alert.alert('오류', '데이터 추가 실패');
        }
    };

    const getTeamInfo = (id: string) => TEAMS.find((t) => t.id === id);

    const groupGamesByDate = (games: Game[]) => {
        const grouped: { [key: string]: Game[] } = {};
        games.forEach((game) => {
            if (!grouped[game.date]) {
                grouped[game.date] = [];
            }
            grouped[game.date].push(game);
        });
        return Object.keys(grouped).map((date) => ({
            date,
            data: grouped[date],
        }));
    };

    const sections = groupGamesByDate(games);

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const renderGameItem = ({ item }: { item: Game }) => {
        const homeTeam = getTeamInfo(item.homeTeamId);
        const awayTeam = getTeamInfo(item.awayTeamId);
        const isToday = item.date === todayStr;

        return (
            <View style={[
                styles.gameCard,
                isToday && { borderWidth: 2, borderColor: primaryColor }
            ]}>
                {isToday && (
                    <View style={[styles.todayBadge, { backgroundColor: primaryColor }]}>
                        <Text style={styles.todayText}>TODAY</Text>
                    </View>
                )}
                <View style={styles.gameInfo}>
                    <Text style={styles.time}>{item.time}</Text>
                    <Text style={styles.stadium}>{item.stadium}</Text>
                </View>
                <View style={styles.matchup}>
                    <View style={styles.teamContainer}>
                        {awayTeam?.image && <Image source={awayTeam.image} style={styles.logo} resizeMode="contain" />}
                        <Text style={styles.teamName}>{awayTeam?.name}</Text>
                    </View>

                    <View style={styles.centerContainer}>
                        {item.status === 'finished' && item.awayScore !== undefined && item.homeScore !== undefined ? (
                            <Text style={styles.scoreText}>
                                {item.awayScore} <Text style={styles.vs}>:</Text> {item.homeScore}
                            </Text>
                        ) : item.status === 'canceled' ? (
                            <Text style={styles.statusText}>취소</Text>
                        ) : (
                            <Text style={styles.statusText}>예정</Text>
                        )}
                    </View>

                    <View style={styles.teamContainer}>
                        {homeTeam?.image && <Image source={homeTeam.image} style={styles.logo} resizeMode="contain" />}
                        <Text style={styles.teamName}>{homeTeam?.name}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: primaryColor }]}>경기 일정</Text>
                {/* Dev only button */}
                <TouchableOpacity onPress={seedData} style={styles.seedButton}>
                    <Text style={styles.seedButtonText}>+ Test Data</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primaryColor} />
                </View>
            ) : (
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item }) => (
                        <View>
                            <View style={styles.dateHeader}>
                                <Text style={styles.dateText}>
                                    {format(new Date(item.date), 'M월 d일 EEEE', { locale: ko })}
                                </Text>
                            </View>
                            {item.data.map((game) => (
                                <View key={game.id} style={styles.gameWrapper}>
                                    {renderGameItem({ item: game })}
                                </View>
                            ))}
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    seedButton: {
        padding: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    seedButtonText: {
        fontSize: 10,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    dateHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    gameWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    gameCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    gameInfo: {
        width: 80,
        borderRightWidth: 1,
        borderRightColor: '#eee',
        marginRight: 16,
        justifyContent: 'center',
    },
    time: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    stadium: {
        fontSize: 11,
        color: '#888',
    },
    matchup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teamContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    logo: {
        width: 32,
        height: 32,
    },
    teamName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    todayBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        zIndex: 1,
    },
    todayText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    centerContainer: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
    },
    statusText: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    vs: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        paddingHorizontal: 4,
    },
});
