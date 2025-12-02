import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  Title,
  Card,
  Avatar,
  Provider as PaperProvider,
  DefaultTheme,
  TextInput,
  IconButton,
  HelperText,
  Switch,
  Text
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../components/Perfil/ProfileHeader';
import { MaskedTextInput } from 'react-native-mask-text';
import { MotiView } from 'moti';

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
  },
};

const ProfileScreen = ({ onLogout, onUpdateUser }) => { // Recebe onUpdateUser
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
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
        setErrors(prev => ({...prev, cep: 'CEP não encontrado.'}));
    } 
    finally { setIsLoadingCep(false); }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) { newErrors.name = 'Nome é obrigatório.'; isValid = false; }
    if (!formData.email.includes('@')) { newErrors.email = 'E-mail inválido.'; isValid = false; }
    const cpfClean = formData.cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) { newErrors.cpf = 'CPF incompleto.'; isValid = false; }

    if (formData.password) {
        if (!formData.currentPassword) { newErrors.currentPassword = 'Informe a senha atual.'; isValid = false; }
        if (formData.password.length < 6) { newErrors.password = 'Mínimo 6 caracteres.'; isValid = false; }
        if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Senhas não coincidem.'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Aqui está a mágica: atualiza local E chama a função do pai (App.jsx)
  const handleProfileUpdate = () => {
    fetchProfileData();
    if (onUpdateUser) onUpdateUser();
  };

  const handleLogoutPress = async () => {
    try {
        await AsyncStorage.multiRemove(['token', 'user']);
    } finally {
        onLogout();
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
            cep: formData.cep,
            logradouro: formData.logradouro,
            numero: formData.numero,
            bairro: formData.bairro,
            cidade: formData.cidade,
            uf: formData.uf,
        };
        
        if (formData.password) {
            payload.password = formData.password;
        }

        await axios.put(`${API_URL}/user/me`, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        setEditModalVisible(false);
        handleProfileUpdate(); // Atualiza tudo
        setFormData(prev => ({...prev, currentPassword: '', password: '', confirmPassword: ''}));
        Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
        const msg = error.response?.data?.message || "Falha ao atualizar dados.";
        Alert.alert("Erro", msg);
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PaperProvider theme={blueTheme}>
        <View style={styles.centeredContainer}><ActivityIndicator size="large" color="#0A84FF" /></View>
      </PaperProvider>
    );
  }

  if (!user) return null;

  return (
    <PaperProvider theme={blueTheme}>
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            
            <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing' }}>
                <ProfileHeader user={{
                    name: user.user_name || user.name,
                    email: user.user_email || user.email,
                    img_url: user.user_img_url || user.img_url,
                    role: user.role
                }} onProfileUpdate={handleProfileUpdate} />
            </MotiView>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Configurações</Text>
                
                <TouchableOpacity onPress={() => setEditModalVisible(true)} activeOpacity={0.7}>
                    <View style={styles.optionRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <IconButton icon="account-cog" iconColor="#0A84FF" size={24} style={{margin:0}} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.optionTitle}>Editar Perfil</Text>
                            <Text style={styles.optionSub}>Nome, endereço e senha</Text>
                        </View>
                        <IconButton icon="chevron-right" iconColor="#CCC" size={24} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.optionRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                        <IconButton icon="bell-outline" iconColor="#FF9800" size={24} style={{margin:0}} />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.optionTitle}>Notificações</Text>
                        <Text style={styles.optionSub}>Alertas de consumo e metas</Text>
                    </View>
                    <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} color="#0A84FF" />
                </View>
                
                <View style={styles.divider} />

                <TouchableOpacity onPress={() => Linking.openURL('mailto:support@aqua.com')} activeOpacity={0.7}>
                    <View style={styles.optionRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <IconButton icon="help-circle-outline" iconColor="#4CAF50" size={24} style={{margin:0}} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.optionTitle}>Ajuda e Suporte</Text>
                            <Text style={styles.optionSub}>Fale com nossa equipe</Text>
                        </View>
                        <IconButton icon="chevron-right" iconColor="#CCC" size={24} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={handleLogoutPress} activeOpacity={0.7}>
                    <View style={styles.optionRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                            <IconButton icon="logout" iconColor="#FF3B30" size={24} style={{margin:0}} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.optionTitle, {color: '#FF3B30'}]}>Sair da Conta</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>Aqua App v1.0.0</Text>
            <View style={{height: 30}} />

        </ScrollView>

        <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditModalVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1, backgroundColor:'#F2F2F7'}}>
                <View style={styles.modalHeader}>
                    <Title style={{fontSize: 18, fontWeight: 'bold'}}>Editar Dados</Title>
                    <Button onPress={() => setEditModalVisible(false)}>Fechar</Button>
                </View>
                <ScrollView contentContainerStyle={{padding: 20}} showsVerticalScrollIndicator={false}>
                    <Card style={styles.formCard}>
                        <Card.Content>
                            <Title style={styles.formTitle}>Pessoal</Title>
                            <TextInput label="Nome" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} mode="outlined" style={styles.input} dense />
                            <TextInput label="E-mail" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} mode="outlined" style={styles.input} dense keyboardType="email-address" />
                            <TextInput label="CPF" value={formData.cpf} mode="outlined" style={styles.input} dense render={p => <MaskedTextInput {...p} mask="999.999.999-99" onChangeText={(t, r) => setFormData({...formData, cpf: t})} />} />
                        </Card.Content>
                    </Card>

                    <Card style={styles.formCard}>
                        <Card.Content>
                            <Title style={styles.formTitle}>Endereço</Title>
                            <View style={{flexDirection:'row', gap:10}}>
                                <TextInput label="CEP" value={formData.cep} mode="outlined" style={[styles.input, {flex:1}]} dense keyboardType="numeric" right={isLoadingCep && <TextInput.Icon icon="loading"/>} render={p => <MaskedTextInput {...p} mask="99999-999" onChangeText={(t, r) => { setFormData({...formData, cep: t}); if(r.length===8) fetchAddressFromCep(r); }} />} />
                                <TextInput label="Nº" value={formData.numero} onChangeText={t => setFormData({...formData, numero: t})} mode="outlined" style={[styles.input, {width:80}]} dense />
                            </View>
                            <TextInput label="Logradouro" value={formData.logradouro} onChangeText={t => setFormData({...formData, logradouro: t})} mode="outlined" style={styles.input} dense />
                            <TextInput label="Bairro" value={formData.bairro} onChangeText={t => setFormData({...formData, bairro: t})} mode="outlined" style={styles.input} dense />
                            <View style={{flexDirection:'row', gap:10}}>
                                <TextInput label="Cidade" value={formData.cidade} onChangeText={t => setFormData({...formData, cidade: t})} mode="outlined" style={[styles.input, {flex:1}]} dense />
                                <TextInput label="UF" value={formData.uf} onChangeText={t => setFormData({...formData, uf: t})} mode="outlined" style={[styles.input, {width:60}]} dense maxLength={2} />
                            </View>
                        </Card.Content>
                    </Card>

                    <Card style={styles.formCard}>
                        <Card.Content>
                            <Title style={styles.formTitle}>Segurança</Title>
                            <TextInput label="Senha Atual" value={formData.currentPassword} onChangeText={t => setFormData({...formData, currentPassword: t})} mode="outlined" style={styles.input} dense secureTextEntry={!showCurrentPassword} right={<TextInput.Icon icon="eye" onPress={() => setShowCurrentPassword(!showCurrentPassword)}/>} />
                            <TextInput label="Nova Senha" value={formData.password} onChangeText={t => setFormData({...formData, password: t})} mode="outlined" style={styles.input} dense secureTextEntry={!showPassword} right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)}/>} />
                            <TextInput label="Confirmar" value={formData.confirmPassword} onChangeText={t => setFormData({...formData, confirmPassword: t})} mode="outlined" style={styles.input} dense secureTextEntry={!showConfirmPassword} right={<TextInput.Icon icon="eye" onPress={() => setShowConfirmPassword(!showConfirmPassword)}/>} />
                        </Card.Content>
                    </Card>

                    <Button mode="contained" onPress={handleSaveData} loading={isSaving} style={styles.saveButton} contentStyle={{paddingVertical: 6}}>Salvar Alterações</Button>
                    <View style={{height:40}}/>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
        </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  contentContainer: { paddingBottom: 20 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
  sectionContainer: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 10, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginTop: 10, marginBottom: 10, color: '#1C1C1E' },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  optionSub: { fontSize: 12, color: '#8A8A8E' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 65 },
  versionText: { textAlign: 'center', color: '#AEAEB2', fontSize: 12, marginTop: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  formCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0A84FF', marginBottom: 10 },
  input: { backgroundColor: '#fff', marginBottom: 10, fontSize: 14 },
  saveButton: { borderRadius: 10, marginTop: 10, backgroundColor: '#0A84FF' }
});

export default ProfileScreen;