import TicketCard, { TicketResult } from '@/src/components/TicketCard';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

// Dummy Data for MVP Verification
const DUMMY_TICKETS = [
  {
    id: '1',
    date: '05.05',
    day: 'Sat',
    matchup: 'Hanwha vs LG',
    result: 'WIN' as TicketResult,
    score: '5:4',
    stadium: 'Jamsil Stadium',
    seat: '101 Block 12 Row',
  },
  {
    id: '2',
    date: '04.28',
    day: 'Sun',
    matchup: 'Hanwha vs Doosan',
    result: 'LOSE' as TicketResult,
    score: '2:10',
    stadium: 'Daejeon Eagles Park',
    seat: 'Central Table',
  },
  {
    id: '3',
    date: '04.15',
    day: 'Fri',
    matchup: 'Hanwha vs Kia',
    result: 'DRAW' as TicketResult,
    score: '3:3',
    stadium: 'Gwangju Kia Field',
    seat: 'K9 Zone',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>My TicketBook</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3 Games</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={DUMMY_TICKETS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketCard
            date={item.date}
            day={item.day}
            matchup={item.matchup}
            result={item.result}
            score={item.score}
            stadium={item.stadium}
            seat={item.seat}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  badge: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
});

// Helper component for text to avoid import issues from template
import { Text } from 'react-native';
