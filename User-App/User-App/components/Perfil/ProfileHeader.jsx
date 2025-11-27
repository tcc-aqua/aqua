import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Avatar, Title, Paragraph, useTheme, Card, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// IMPORTANTE: Se rodar no celular físico, mude localhost para o IP do seu PC (ex: 192.168.x.x)
const API_URL = 'http://localhost:3334';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const { colors } = useTheme();
  const [isUploading, setIsUploading] = React.useState(false);

  if (!user) return null;

  // Função para garantir que a imagem não venha do cache após update
  const getFullImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    const cleanUrl = imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
    // Adiciona timestamp para evitar cache da imagem antiga
    return `${cleanUrl}?t=${new Date().getTime()}`;
  };

  const handlePickAndUploadImage = async () => {
    // 1. Pedir permissão
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para alterar sua foto.");
      return;
    }

    // 2. Selecionar imagem
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (pickerResult.canceled) return;

    setIsUploading(true);

    try {
      const asset = pickerResult.assets[0];
      const localUri = asset.uri;
      
      // Preparar nome e tipo do arquivo
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;

      // 3. Montar FormData
      const formData = new FormData();
      formData.append('file', { 
        uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri, 
        name: filename, 
        type 
      });

      const authToken = await AsyncStorage.getItem('token');
      
      // 4. Enviar para o Backend
      const response = await axios.post(`${API_URL}/api/user/upload-img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        // Callback para a tela pai recarregar os dados
        onProfileUpdate(); 
      }

    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Falha ao enviar a imagem. Verifique sua conexão.");
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = getFullImageUrl(user.img_url); // Usa img_url direto do banco (conforme seu model)
  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={handlePickAndUploadImage} disabled={isUploading} activeOpacity={0.8}>
          {imageUrl ? (
            <Avatar.Image
              size={130}
              source={{ uri: imageUrl }}
              style={{ backgroundColor: colors.surfaceVariant }}
            />
          ) : (
            <Avatar.Text
              size={130}
              label={userInitials}
              style={{ backgroundColor: colors.primaryContainer }}
              labelStyle={{ color: colors.onPrimaryContainer, fontSize: 40 }}
            />
          )}

          {/* Botão de Câmera Flutuante */}
          <View style={[styles.editIconContainer, { backgroundColor: colors.primary }]}>
            <IconButton icon="camera" iconColor="#FFF" size={20} style={{ margin: 0 }} />
          </View>

          {/* Loading Overlay */}
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Title style={styles.name}>{user.name}</Title>
      <Paragraph style={styles.email}>{user.email}</Paragraph>
      
      <View style={[styles.badge, { backgroundColor: user.role === 'sindico' ? colors.tertiaryContainer : colors.secondaryContainer }]}>
         <Paragraph style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>
            {user.role === 'sindico' ? 'SÍNDICO' : 'MORADOR'}
         </Paragraph>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 25,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 65, // Metade do size do Avatar (130)
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  email: {
    fontSize: 14,
    color: '#8A8A8E',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4
  }
});

export default ProfileHeader;