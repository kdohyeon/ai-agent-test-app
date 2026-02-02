import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TEAMS, Team } from '../../constants/teams';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export default function OnboardingScreen() {
    const router = useRouter();
    const { setTeam } = useTheme();

    const handleSelectTeam = async (teamId: string) => {
        await setTeam(teamId);
        router.replace('/');
    };

    const renderItem = ({ item }: { item: Team }) => (
        <TouchableOpacity
            style={[styles.card, { borderColor: item.primaryColor }]}
            onPress={() => handleSelectTeam(item.id)}
            activeOpacity={0.8}
        >
            <View style={[styles.imageContainer, { backgroundColor: item.primaryColor + '10' }]}>
                <Image source={item.image} style={styles.teamImage} resizeMode="contain" />
            </View>
            <View style={styles.details}>
                <Text style={[styles.teamName, { color: item.primaryColor }]}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>환영합니다!</Text>
                <Text style={styles.subtitle}>응원하는 구단을 선택해주세요.</Text>
            </View>
            <FlatList
                data={TEAMS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        padding: 16,
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
    },
    imageContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    teamImage: {
        width: 80,
        height: 80,
    },
    details: {
        padding: 12,
        alignItems: 'center',
    },
    teamName: {
        fontSize: 16,
        fontWeight: '700',
    },
});
