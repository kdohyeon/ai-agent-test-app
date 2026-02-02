import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TEAMS, Team } from '../constants/teams';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function SettingsScreen() {
    const router = useRouter();
    const { selectedTeam, setTeam } = useTheme();

    const handleSelectTeam = async (teamId: string) => {
        await setTeam(teamId);
        // Optional: Go back automatically or show feedback
        // router.back();
    };

    const renderItem = ({ item }: { item: Team }) => {
        const isSelected = selectedTeam?.id === item.id;
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    { borderColor: item.primaryColor },
                    isSelected && styles.selectedCard
                ]}
                onPress={() => handleSelectTeam(item.id)}
                activeOpacity={0.8}
            >
                <View style={[styles.imageContainer, { backgroundColor: item.primaryColor + '10' }]}>
                    <Image source={item.image} style={styles.teamImage} resizeMode="contain" />
                </View>
                <View style={[styles.details, isSelected && { backgroundColor: item.primaryColor }]}>
                    <Text style={[
                        styles.teamName,
                        { color: isSelected ? '#fff' : item.primaryColor }
                    ]}>
                        {item.name}
                    </Text>
                </View>
                {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: item.primaryColor }]}>
                        <Text style={styles.checkText}>V</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: '설정', headerBackTitle: '뒤로' }} />

            <View style={styles.header}>
                <Text style={styles.sectionTitle}>나의 구단</Text>
                {selectedTeam ? (
                    <View style={[styles.currentTeamCard, { borderColor: selectedTeam.primaryColor }]}>
                        <View style={[styles.currentTeamImageWrapper, { backgroundColor: selectedTeam.primaryColor + '10' }]}>
                            <Image source={selectedTeam.image} style={styles.currentTeamImage} resizeMode="contain" />
                        </View>
                        <View>
                            <Text style={styles.currentTeamLabel}>현재 응원하고 있는 구단</Text>
                            <Text style={[styles.currentTeamName, { color: selectedTeam.primaryColor }]}>{selectedTeam.name}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.noTeamText}>선택된 구단이 없습니다.</Text>
                )}
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>구단 변경하기</Text>
                <FlatList
                    data={TEAMS}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    currentTeamCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 16,
    },
    currentTeamImageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentTeamImage: {
        width: 40,
        height: 40,
    },
    currentTeamLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    currentTeamName: {
        fontSize: 20,
        fontWeight: '800',
    },
    noTeamText: {
        color: '#999',
        fontStyle: 'italic',
    },
    listContainer: {
        flex: 1,
        padding: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: ITEM_WIDTH,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginTop: 4, // for shadow
    },
    selectedCard: {
        transform: [{ scale: 1.02 }],
        borderWidth: 2,
    },
    imageContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    teamImage: {
        width: 60,
        height: 60,
    },
    details: {
        padding: 12,
        alignItems: 'center',
    },
    teamName: {
        fontSize: 14,
        fontWeight: '700',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
