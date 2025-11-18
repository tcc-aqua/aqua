import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Avatar, Title, Paragraph, useTheme, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3334';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const { colors } = useTheme();
  const [isUploading, setIsUploading] = React.useState(false);

  if (!user) {
    return null;
  }

  const getFullImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL}${imgUrl}`;
  };

  const handlePickAndUploadImage = async () => {
    setIsUploading(true);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para trocar a foto.");
      setIsUploading(false);
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (pickerResult.canceled) {
      setIsUploading(false);
      return;
    }

    const localUri = pickerResult.assets[0].uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', { uri: localUri, name: filename, type });

    try {
      const authToken = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/user/upload-img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.img_url) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Erro no upload da imagem:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível enviar sua imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = getFullImageUrl(user.user_img_url);
  const userInitials = user.user_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '';

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickAndUploadImage} disabled={isUploading}>
            {imageUrl ? (
              <Avatar.Image
                size={120}
                source={{ uri: imageUrl }}
                style={{ backgroundColor: colors.surfaceVariant }}
              />
            ) : (
              <Avatar.Text
                size={120}
                label={userInitials}
                style={{ backgroundColor: colors.primaryContainer }}
                labelStyle={{ color: colors.onPrimaryContainer }}
              />
            )}
            <View style={[styles.editIconContainer, { backgroundColor: colors.primary }]}>
              <Avatar.Icon size={36} icon="camera-plus-outline" color="#FFF" style={{ backgroundColor: 'transparent' }} />
            </View>
            {isUploading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Title style={styles.name}>{user.user_name}</Title>
        <Paragraph style={styles.email}>{user.user_email}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 50,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileHeader;