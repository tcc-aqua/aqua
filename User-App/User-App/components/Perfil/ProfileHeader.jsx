import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Paragraph, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const ProfileHeader = ({ user }) => {
    if (!user) return null;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 600 }}
        >
            <LinearGradient
                colors={['#0A84FF', '#005ECB']}
                style={styles.headerContainer}
            >
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={90}
                        source={{ uri: `https://api.dicebear.com/8.x/initials/svg?seed=${user.user_name}` }}
                        style={styles.avatar}
                    />
                </View>
                <Title style={styles.userName}>{user.user_name}</Title>
                <View style={styles.userInfoDetailRow}>
                    <Icon source="email-outline" size={16} color="#EAEAEA" />
                    <Paragraph style={styles.infoText}>{user.user_email}</Paragraph>
                </View>
                <View style={styles.userInfoDetailRow}>
                    <Icon source="map-marker-outline" size={16} color="#EAEAEA" />
                    <Paragraph style={styles.infoText}>{user.logradouro}, {user.numero}</Paragraph>
                </View>
            </LinearGradient>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 8,
        shadowColor: '#005ECB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    avatarContainer: {
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 50,
        padding: 2,
        marginBottom: 10,
    },
    avatar: {
        backgroundColor: '#fff'
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    userInfoDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#EAEAEA',
        flexShrink: 1,
    },
});

export default ProfileHeader;