import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  useTheme,
  Snackbar,
  Title,
  Paragraph,
  Card,
  Avatar,
  Provider as PaperProvider,
  DefaultTheme,
  TextInput,
  IconButton,
  HelperText
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../components/Perfil/ProfileHeader';
import { MaskedTextInput, mask } from 'react-native-mask-text';

const API_URL = 'http://localhost:3334/api';

const blueTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    accent: '#0A84FF',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    placeholder: '#8A8A8E',
    onSurface: '#1C1C1E',
    error: '#FF3B30',
    elevation: {
      level2: '#FFFFFF'
    }
  },
};

const ProfileScreen = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    // Senhas
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        onLogout();
        return;
      }
      const headers = { Authorization: `Bearer ${authToken}` };
      
      const fullProfile = await axios.get(`${API_URL}/profile`, { headers });
      
      if (fullProfile.data) {
        const data = fullProfile.data;
        setUser(data);
        
        setFormData({
            name: data.user_name || data.name || '',
            email: data.user_email || data.email || '',
            cpf: data.cpf || '',
            
            // Mapeando dados de endereço (ajuste conforme seu retorno do backend)
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || '',

            currentPassword: '',
            password: '',
            confirmPassword: ''
        });
      }

    } catch (error) {
      console.error("ERRO AO BUSCAR PERFIL:", error);
      if (error.response?.status === 401) onLogout();
      else Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const fetchAddressFromCep = async (cepValue) => {
    const unmaskedCep = cepValue.replace(/\D/g, '');
    if (unmaskedCep.length !== 8) return;
    
    setIsLoadingCep(true);
    try {
        const response = await axios.get(`${API_URL}/cep/${unmaskedCep}`);
        const data = response.data;
        
        if (data) {
            setFormData(prev => ({
                ...prev,
                logradouro: data.logradouro || prev.logradouro,
                bairro: data.bairro || prev.bairro,
                cidade: data.cidade || prev.cidade,
                uf: data.uf || prev.uf
            }));
        }
    } catch (error) { 
        console.error("Erro ao buscar CEP:", error);
        setErrors(prev => ({...prev, cep: 'CEP não encontrado.'}));
    } 
    finally { setIsLoadingCep(false); }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório.';
        isValid = false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
        newErrors.email = 'E-mail inválido.';
        isValid = false;
    }

    const cpfClean = formData.cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
        newErrors.cpf = 'CPF incompleto.';
        isValid = false;
    }

    // Validação de Senha
    if (formData.password) {
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Para alterar a senha, informe a senha atual.';
            isValid = false;
        }
        if (formData.password.length < 6) {
            newErrors.password = 'A nova senha deve ter no mínimo 6 caracteres.';
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProfileUpdate = () => {
    setSnackbar({ visible: true, message: 'Foto de perfil atualizada!' });
    setTimeout(() => {
        fetchProfileData();
    }, 500);
  };

  const handleLogoutPress = async () => {
    try {
        await AsyncStorage.multiRemove(['token', 'user']);
    } catch (e) {
        console.error(e);
    } finally {
        onLogout();
    }
  };

  const handleContactSupport = async () => {
    const email = 'servicesaquateam@gmail.com';
    const subject = `Suporte Aqua - Usuário: ${user?.user_name || 'Desconhecido'}`;
    const body = 'Olá equipe Aqua, preciso de ajuda com...';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
        await Linking.openURL(url);
    } else {
        setSnackbar({ visible: true, message: 'Não foi possível abrir o app de e-mail.' });
    }
  };

  const handleSaveData = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
        const authToken = await AsyncStorage.getItem('token');
        const payload = {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            // Enviando endereço
            cep: formData.cep,
            logradouro: formData.logradouro,
            numero: formData.numero,
            bairro: formData.bairro,
            cidade: formData.cidade,
            uf: formData.uf,
        };
        
        if (formData.password) {
            payload.password = formData.password;
            // Opcional: Enviar currentPassword se o backend exigir verificação
            // payload.currentPassword = formData.currentPassword; 
        }

        await axios.put(`${API_URL}/user/me`, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        setEditModalVisible(false);
        setSnackbar({ visible: true, message: 'Dados atualizados com sucesso!' });
        fetchProfileData();
        setFormData(prev => ({...prev, currentPassword: '', password: '', confirmPassword: ''}));
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        const msg = error.response?.data?.message || "Falha ao atualizar dados.";
        Alert.alert("Erro", msg);
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PaperProvider theme={blueTheme}>
        <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      </PaperProvider>
    );
  }

  if (!user) {
    return (
      <PaperProvider theme={blueTheme}>
        <View style={styles.centeredContainer}>
            <Title>Erro ao carregar perfil.</Title>
            <Button onPress={onLogout} style={{ marginTop: 20 }}>Voltar ao Login</Button>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={blueTheme}>
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            
            <ProfileHeader user={{
                name: user.user_name || user.name,
                email: user.user_email || user.email,
                img_url: user.user_img_url || user.img_url,
                role: user.role
            }} onProfileUpdate={handleProfileUpdate} />

            <TouchableOpacity onPress={() => setEditModalVisible(true)} activeOpacity={0.9}>
                <Card style={styles.actionCard}>
                    <View style={styles.cardContent}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Avatar.Icon size={32} icon="account-edit-outline" color="#0A84FF" style={{ backgroundColor: 'transparent' }} />
                        </View>
                        <View style={styles.cardText}>
                            <Title style={styles.cardTitle}>Meus Dados</Title>
                            <Paragraph style={styles.cardSubtitle}>
                                Dados pessoais, endereço e senha
                            </Paragraph>
                        </View>
                        <Avatar.Icon size={24} icon="chevron-right" color="#DDD" style={{ backgroundColor: 'transparent' }} />
                    </View>
                </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleContactSupport} activeOpacity={0.9}>
                <Card style={styles.actionCard}>
                    <View style={styles.cardContent}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Avatar.Icon size={32} icon="email-outline" color="#0A84FF" style={{ backgroundColor: 'transparent' }} />
                        </View>
                        <View style={styles.cardText}>
                            <Title style={styles.cardTitle}>Suporte</Title>
                            <Paragraph style={styles.cardSubtitle}>
                                Fale com nossa equipe
                            </Paragraph>
                        </View>
                        <Avatar.Icon size={24} icon="chevron-right" color="#DDD" style={{ backgroundColor: 'transparent' }} />
                    </View>
                </Card>
            </TouchableOpacity>

        </ScrollView>

        <View style={styles.footer}>
            <Button 
                icon="logout" 
                mode="outlined" 
                onPress={handleLogoutPress} 
                textColor="#FF3B30"
                style={{ borderColor: '#FF3B30', width: '100%', borderRadius: 12 }}
                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
            >
            Sair da Conta
            </Button>
            <Paragraph style={styles.versionText}>Versão 1.0.0</Paragraph>
        </View>

        <Modal
            visible={editModalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setEditModalVisible(false)}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1, backgroundColor:'#fff'}}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Title style={styles.modalTitle}>Editar Dados</Title>
                        <IconButton icon="close" size={24} onPress={() => setEditModalVisible(false)} />
                    </View>
                    
                    <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                        
                        <Title style={styles.sectionHeader}>Informações Pessoais</Title>
                        <View style={styles.inputGroup}>
                            <TextInput
                                label="Nome Completo"
                                value={formData.name}
                                onChangeText={(text) => setFormData({...formData, name: text})}
                                mode="outlined"
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                error={!!errors.name}
                                left={<TextInput.Icon icon="account-outline" color="#0A84FF" />}
                            />
                            {errors.name && <HelperText type="error">{errors.name}</HelperText>}
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <TextInput
                                label="E-mail"
                                value={formData.email}
                                onChangeText={(text) => setFormData({...formData, email: text})}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                error={!!errors.email}
                                left={<TextInput.Icon icon="email-outline" color="#0A84FF" />}
                            />
                            {errors.email && <HelperText type="error">{errors.email}</HelperText>}
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                label="CPF"
                                value={formData.cpf}
                                mode="outlined"
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                error={!!errors.cpf}
                                keyboardType="numeric"
                                left={<TextInput.Icon icon="card-account-details-outline" color="#0A84FF" />}
                                render={props => (
                                    <MaskedTextInput
                                      {...props}
                                      mask="999.999.999-99"
                                      onChangeText={(text, raw) => setFormData({...formData, cpf: text})}
                                    />
                                )}
                            />
                            {errors.cpf && <HelperText type="error">{errors.cpf}</HelperText>}
                        </View>

                        <Title style={styles.sectionHeader}>Endereço</Title>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    label="CEP"
                                    value={formData.cep}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#0A84FF"
                                    keyboardType="numeric"
                                    right={isLoadingCep ? <TextInput.Icon icon="loading" /> : null}
                                    render={props => (
                                        <MaskedTextInput
                                            {...props}
                                            mask="99999-999"
                                            onChangeText={(text, raw) => {
                                                setFormData({...formData, cep: text});
                                                if (raw.length === 8) fetchAddressFromCep(raw);
                                            }}
                                        />
                                    )}
                                />
                            </View>
                            <View style={{width: 100}}>
                                <TextInput
                                    label="Nº"
                                    value={formData.numero}
                                    onChangeText={text => setFormData({...formData, numero: text})}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#0A84FF"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <TextInput
                            label="Rua / Logradouro"
                            value={formData.logradouro}
                            onChangeText={text => setFormData({...formData, logradouro: text})}
                            mode="outlined"
                            style={styles.input}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#0A84FF"
                        />

                        <TextInput
                            label="Bairro"
                            value={formData.bairro}
                            onChangeText={text => setFormData({...formData, bairro: text})}
                            mode="outlined"
                            style={styles.input}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#0A84FF"
                        />

                        <View style={{flexDirection: 'row', gap: 10}}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    label="Cidade"
                                    value={formData.cidade}
                                    onChangeText={text => setFormData({...formData, cidade: text})}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#0A84FF"
                                />
                            </View>
                            <View style={{width: 80}}>
                                <TextInput
                                    label="UF"
                                    value={formData.uf}
                                    onChangeText={text => setFormData({...formData, uf: text})}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#0A84FF"
                                    maxLength={2}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        <View style={styles.divider}>
                            <Paragraph style={styles.dividerText}>Segurança</Paragraph>
                        </View>

                        {/* SENHA ATUAL - OBRIGATÓRIA SE MUDAR A SENHA */}
                        <View style={styles.inputGroup}>
                            <TextInput
                                label="Senha Atual"
                                value={formData.currentPassword}
                                onChangeText={(text) => setFormData({...formData, currentPassword: text})}
                                mode="outlined"
                                secureTextEntry={!showCurrentPassword}
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                error={!!errors.currentPassword}
                                left={<TextInput.Icon icon="lock-alert-outline" color="#0A84FF" />}
                                right={<TextInput.Icon icon={showCurrentPassword ? "eye-off" : "eye"} onPress={() => setShowCurrentPassword(!showCurrentPassword)} />}
                            />
                            {errors.currentPassword ? (
                                <HelperText type="error">{errors.currentPassword}</HelperText>
                            ) : (
                                <HelperText type="info">Necessária apenas para alterar a senha.</HelperText>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                label="Nova Senha"
                                value={formData.password}
                                onChangeText={(text) => setFormData({...formData, password: text})}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                error={!!errors.password}
                                left={<TextInput.Icon icon="lock-outline" color="#0A84FF" />}
                                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                            />
                            {errors.password && <HelperText type="error">{errors.password}</HelperText>}
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                label="Confirmar Nova Senha"
                                value={formData.confirmPassword}
                                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0A84FF"
                                disabled={!formData.password}
                                error={!!errors.confirmPassword}
                                left={<TextInput.Icon icon="lock-check-outline" color="#0A84FF" />}
                                right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                            />
                            {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}
                        </View>

                        <Button 
                            mode="contained" 
                            onPress={handleSaveData} 
                            loading={isSaving}
                            style={styles.saveButton}
                            contentStyle={{ paddingVertical: 8 }}
                            buttonColor="#0A84FF"
                        >
                            Salvar Alterações
                        </Button>
                        <View style={{height: 40}} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>

        <Snackbar 
            visible={snackbar.visible} 
            onDismiss={() => setSnackbar({ ...snackbar, visible: false })} 
            duration={3000}
            style={{ backgroundColor: '#1C1C1E', borderRadius: 8 }}
        >
            {snackbar.message}
        </Snackbar>
        </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#8A8A8E',
    marginTop: 2,
  },
  footer: {
    padding: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  versionText: {
    marginTop: 12,
    fontSize: 12,
    color: '#AEAEB2',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  modalBody: {
    padding: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 15,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  divider: {
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 5,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A84FF',
  },
  saveButton: {
    marginTop: 30,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#0A84FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  }
});

export default ProfileScreen;