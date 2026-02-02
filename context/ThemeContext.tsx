import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { TEAMS, Team } from '../constants/teams';

interface ThemeContextType {
    selectedTeam: Team | null;
    setTeam: (teamId: string) => Promise<void>;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const storedTeamId = await AsyncStorage.getItem('selected_team_id');
            if (storedTeamId) {
                const team = TEAMS.find((t) => t.id === storedTeamId);
                if (team) {
                    setSelectedTeam(team);
                }
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setTeam = async (teamId: string) => {
        try {
            const team = TEAMS.find((t) => t.id === teamId);
            if (team) {
                await AsyncStorage.setItem('selected_team_id', teamId);
                setSelectedTeam(team);
            }
        } catch (error) {
            console.error('Failed to save team', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ selectedTeam, setTeam, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
