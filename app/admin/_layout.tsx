import { auth } from '@/src/config/firebase';
import { Slot, usePathname, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminLayout() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const inLogin = pathname === '/admin/login';

    useEffect(() => {
        if (loading) return;

        if (!user && !inLogin) {
            router.replace('/admin/login');
        } else if (user && inLogin) {
            router.replace('/admin');
        }
    }, [user, loading, pathname]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // If on login page, just render slot (no sidebar)
    if (inLogin) {
        return <Slot />;
    }

    // Render Guard: If not authenticated and not in login, don't show dashboard content
    // (Effect will redirect, but prevent flash)
    if (!user) {
        return null;
    }

    // Protected Admin Layout
    return (
        <View style={styles.container}>
            {/* Sidebar / Header */}
            <View style={styles.sidebar}>
                <Text style={styles.title}>관리자</Text>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin')}>
                    <Text>대시보드</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/games')}>
                    <Text>경기 일정 관리</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/users')}>
                    <Text>사용자 관리</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.menuItem} onPress={() => auth.signOut()}>
                    <Text style={{ color: 'red' }}>로그아웃</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Slot />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sidebar: {
        width: 240,
        backgroundColor: '#f8f9fa',
        padding: 24,
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    content: {
        flex: 1,
        padding: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    menuItem: {
        paddingVertical: 12,
        marginBottom: 4,
    }
});
