import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Icon, useTheme } from 'react-native-paper';
import { MotiView, useDynamicAnimation } from 'moti';
import { MotiText } from 'moti';

const StatCard = ({ icon, color, label, value, unit = '', delay = 0 }) => {
    const { colors } = useTheme();
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayValue(prev => {
                const diff = value - prev;
                if (Math.abs(diff) < 0.1) {
                    clearInterval(interval);
                    return value;
                }
                return prev + diff * 0.1;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [value]);

    const formattedValue = typeof value === 'number' ? displayValue.toFixed(value % 1 === 0 ? 0 : 2) : value;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 + delay }}
            style={styles.container}
        >
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                        <Icon source={icon} size={28} color={color} />
                    </View>
                    <View style={styles.textContainer}>
                        <MotiText style={[styles.value, { color: colors.text }]}>
                            {formattedValue}
                            <Paragraph style={styles.unit}>{unit}</Paragraph>
                        </MotiText>
                        <Paragraph style={styles.label}>{label}</Paragraph>
                    </View>
                </Card.Content>
            </Card>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: '48%',
    },
    card: {
        borderRadius: 16,
        elevation: 2,
    },
    content: {
        padding: 16,
        alignItems: 'flex-start',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 12,
    },
    textContainer: {
        alignItems: 'flex-start',
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default StatCard;