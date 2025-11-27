import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Avatar, Title, Paragraph, useTheme, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ATENÇÃO: Se estiver no celular, troque 'localhost' pelo IP do seu PC (ex: 192.168.1.5)
const API_URL = 'http://localhost:3334';

const ProfileHeader = ({ user, onProfileUpdate }) => {
  const { colors } = useTheme();
  const [isUploading, setIsUploading] = React.useState(false);

  if (!user) return null;

  // Lógica para montar a URL da imagem baseada no que está salvo no Banco de Dados
  const getFullImageUrl = () => {
    // Tenta pegar o campo img_url (padrão tabela) ou user_img_url (padrão view)
    const dbImageString = user.img_url || user.user_img_url;

    if (!dbImageString) return null;

    // Se no banco já estiver salvo como link completo (ex: Google Auth), usa ele
    if (dbImageString.startsWith('http')) {
        return dbImageString;
    }

    // Se estiver salvo o caminho relativo (ex: /api/uploads/foto.jpg), monta com a API
    // Removemos a barra inicial do dbString se houver, para evitar duplicidade com a barra da API_URL
    const cleanPath = dbImageString.startsWith('/') ? dbImageString : `/${dbImageString}`;
    
    // Adiciona timestamp (?t=...) para impedir que o celular mostre a foto velha (cache)
    return `${API_URL}${cleanPath}?t=${new Date().getTime()}`;
  };

  const handlePickAndUploadImage = async () => {
    // 1. Permissão
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão negada", "É necessário permitir o acesso à galeria.");
      return;
    }

    // 2. Seleção
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (pickerResult.canceled) return;

    setIsUploading(true);

    try {
      const asset = pickerResult.assets[0];
      const localUri = asset.uri;
      
      // Preparar arquivo para envio
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
      
      // 3. Envio para o Backend (que salvará no servidor e atualizará o caminho no Banco)
      const response = await axios.post(`${API_URL}/api/user/upload-img`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        onProfileUpdate(); // Atualiza a tela pai
      }

    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Falha ao enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = getFullImageUrl();
  
  // Pega as iniciais do nome ou usa o nome vindo da View ou Tabela
  const userName = user.user_name || user.name || 'Usuário';
  const userEmail = user.user_email || user.email || '';
  const userRole = user.role || user.user_role || 'morador';
  
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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

          <View style={[styles.editIconContainer, { backgroundColor: colors.primary }]}>
            <IconButton icon="camera" iconColor="#FFF" size={20} style={{ margin: 0 }} />
          </View>

          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Title style={styles.name}>{userName}</Title>
      <Paragraph style={styles.email}>{userEmail}</Paragraph>
      
      <View style={[styles.badge, { backgroundColor: userRole === 'sindico' ? '#FFD700' : '#E0E0E0' }]}>
         <Paragraph style={{ fontSize: 12, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' }}>
            {userRole}
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
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 65,
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