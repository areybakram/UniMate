import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function LogsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={["#1e293b", "#334155"]} style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Patrol Logs</Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.text}>Patrol Logs Coming Soon 📋</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8FAFC' 
    },
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: { 
        fontSize: 18, 
        color: '#6B7280', 
        fontWeight: '500' 
    }
});
