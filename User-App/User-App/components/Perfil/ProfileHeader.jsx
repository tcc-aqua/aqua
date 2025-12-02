import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Avatar, Title, Paragraph, useTheme, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = 'http://localhost:3334';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const { colors } = useTheme();
  const [isUploading, setIsUploading] = React.useState(false);

  if (!user) return null;

  const imageUrl = user.img_url || user.user_img_url;
  
  const handlePickAndUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão negada", "É necessário permitir o acesso à galeria.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, 
      base64: false
    });

    if (pickerResult.canceled) return;

    setIsUploading(true);

    try {
      const asset = pickerResult.assets[0];
      const localUri = asset.uri;
      
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('file', { 
        uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri, 
        name: filename, 
        type 
      });

      const authToken = await AsyncStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/api/user/upload-img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        onProfileUpdate(); 
      }

    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Falha ao enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const userName = user.user_name || user.name || 'Usuário';
  const userEmail = user.user_email || user.email || '';
  const userRole = user.role || user.user_role || 'morador';
  
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A84FF', '#005ecb']} style={styles.headerBackground} />
      
      <View style={styles.contentWrapper}>
        <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={handlePickAndUploadImage} disabled={isUploading} activeOpacity={0.8}>
            <View style={styles.avatarBorder}>
                {imageUrl ? (
                    <Avatar.Image
                    size={120}
                    source={{ uri: imageUrl }}
                    style={{ backgroundColor: '#fff' }}
                    />
                ) : (
                    <Avatar.Text
                    size={120}
                    label={userInitials}
                    style={{ backgroundColor: '#E3F2FD' }}
                    labelStyle={{ color: '#0A84FF', fontSize: 40, fontWeight: 'bold' }}
                    />
                )}
            </View>

            <View style={styles.editIconContainer}>
                <IconButton icon="camera" iconColor="#0A84FF" size={20} style={{ margin: 0 }} />
            </View>

            {isUploading && (
                <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0A84FF" />
                </View>
            )}
            </TouchableOpacity>
        </View>

        <Title style={styles.name}>{userName}</Title>
        <Paragraph style={styles.email}>{userEmail}</Paragraph>
        
        <View style={styles.roleContainer}>
            <View style={[styles.badge, { backgroundColor: userRole === 'sindico' ? '#FFF9C4' : '#E3F2FD' }]}>
                <Paragraph style={{ fontSize: 12, fontWeight: 'bold', color: userRole === 'sindico' ? '#FBC02D' : '#0A84FF', textTransform: 'uppercase' }}>
                    {userRole}
                </Paragraph>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 120,
  },
  contentWrapper: {
      alignItems: 'center',
      marginTop: 60,
      paddingBottom: 25
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarBorder: {
      padding: 4,
      backgroundColor: '#fff',
      borderRadius: 64,
      elevation: 2
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#8A8A8E',
    marginBottom: 10,
  },
  roleContainer: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  }
});

export default ProfileHeader;