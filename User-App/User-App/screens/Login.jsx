import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    LayoutAnimation,
    UIManager,
    Dimensions,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    TextInput,
    Button,
    Title,
    Paragraph,
    Provider as PaperProvider,
    DefaultTheme,
    Portal,
    Dialog,
    HelperText,
    Checkbox,
    Snackbar,
    Text,
    Modal,
    Divider,
    Subheading,
    IconButton,
    Icon,
    Surface
} from 'react-native-paper';
import { mask } from 'react-native-mask-text';
import { LinearGradient } from 'expo-linear-gradient';

// Ativa animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://localhost:3334';

// Tema Personalizado com mais arredondamento
const theme = {
    ...DefaultTheme,
    roundness: 16, // Bordas mais redondas nos inputs
    colors: {
        ...DefaultTheme.colors,
        primary: '#0A84FF',
        accent: '#005ecb',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#1C1C1E',
        placeholder: '#9ca3af',
        error: '#FF3B30',
        success: '#34C759',
        backdrop: 'rgba(0,0,0,0.5)'
    },
};

export default function LoginRegisterScreen({ onLogin: onSuccessfulLogin }) {
    const [formType, setFormType] = useState('login');
    const [registrationType, setRegistrationType] = useState('casa');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'default' });

    // Modais e Dialogs
    const [codigoDialogVisible, setCodigoDialogVisible] = useState(false);
    const [planoIndividualDialog, setPlanoIndividualDialog] = useState(false);
    const [planoCondoDialog, setPlanoCondoDialog] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);
    
    // Estados do Formulário
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [codigoAcesso, setCodigoAcesso] = useState('');
    const [bloco, setBloco] = useState('');
    const [numeroMoradores, setNumeroMoradores] = useState('1');

    // Estados Recuperação de Senha
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
    const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const showSnackbar = (message, type = 'default') => {
        setSnackbar({ visible: true, message, type });
    };

    const clearFormFields = () => {
        setName(''); setEmail(''); setSenha(''); setCpf(''); setCep('');
        setLogradouro(''); setNumero(''); setBairro(''); setCidade('');
        setUf(''); setCodigoAcesso(''); setBloco('');
        setNumeroMoradores('1'); setAgreeToTerms(false);
    };

    const handleFormTypeChange = (newType) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        clearFormFields();
        setFormType(newType);
    };

    const fetchAddressFromCep = async (cepValue) => {
        const unmaskedCep = cepValue.replace(/\D/g, '');
        if (unmaskedCep.length !== 8) return null;

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cep/${unmaskedCep}`);
            const addressData = response.data;
            setLogradouro(addressData.logradouro || ''); setBairro(addressData.bairro || '');
            setCidade(addressData.cidade || ''); setUf(addressData.uf || '');
            return addressData;
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            showSnackbar('CEP não encontrado ou inválido.', 'error');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !senha) { showSnackbar('Por favor, preencha e-mail e senha.', 'error'); return; }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password: senha });
            const { token, user } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            showSnackbar('Login realizado com sucesso!', 'success');
            if(onSuccessfulLogin) onSuccessfulLogin(user);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
            showSnackbar(`Erro: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !senha.trim() || !cpf.trim()) { showSnackbar('Preencha todos os campos obrigatórios.', 'error'); return; }
        if (registrationType === 'casa' && (!cep.trim() || !numero.trim())) { showSnackbar('CEP e Número são obrigatórios.', 'error'); return; }
        if (registrationType === 'condominio' && (!codigoAcesso.trim() || !numero.trim())) { showSnackbar('Código e Número são obrigatórios.', 'error'); return; }
        if (!agreeToTerms) { showSnackbar('Aceite os Termos e Condições.', 'error'); return; }

        setIsLoading(true);
        const residencia_type = registrationType === 'condominio' ? 'apartamento' : 'casa';
        const userData = {
            name, email, password: senha, cpf, residencia_type,
            numero_moradores: parseInt(numeroMoradores, 10) || 1,
            cep, numero, bloco, codigo_acesso: codigoAcesso,
        };

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
            showSnackbar('Cadastro realizado! Faça login.', 'success');
            handleFormTypeChange('login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao cadastrar.';
            showSnackbar(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Funções de recuperação de senha (simplificadas visualmente)
    const handleForgotPasswordRequest = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/password/forgot`, { email: resetEmail });
            showSnackbar('Código enviado!', 'success');
            setForgotPasswordModalVisible(false);
            setResetPasswordModalVisible(true);
        } catch (e) { 
            showSnackbar('Verifique o e-mail.', 'error'); 
            setForgotPasswordModalVisible(false);
            setResetPasswordModalVisible(true);
        } finally { setIsLoading(false); }
    };

    const handleResetPasswordSubmit = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/password/reset`, { token: resetToken, newPassword });
            showSnackbar('Senha alterada!', 'success');
            setResetPasswordModalVisible(false);
            handleFormTypeChange('login');
        } catch (e) { showSnackbar('Erro ao redefinir.', 'error'); } 
        finally { setIsLoading(false); }
    };

    const handleAcceptTerms = () => { setAgreeToTerms(true); setTermsVisible(false); };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    // Componentes de UI Reutilizáveis
    const GradientButton = ({ onPress, loading, disabled, children, style }) => (
        <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={[styles.btnContainer, style]}>
            <LinearGradient colors={disabled ? ['#cfd9df', '#e2ebf0'] : ['#0A84FF', '#005ecb']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.btnGradient}>
                {loading ? <Icon source="loading" size={24} color="#FFF" /> : 
                <Text style={styles.btnText}>{children}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    );

    const CustomInput = (props) => (
        <TextInput 
            mode="outlined" 
            outlineColor="#E0E0E0"
            activeOutlineColor={theme.colors.primary}
            style={styles.input}
            contentStyle={{ backgroundColor: '#FAFAFA' }}
            {...props} 
        />
    );

    return (
        <PaperProvider theme={theme}>
            <View style={styles.mainContainer}>
                {/* HEADER COM GRADIENTE */}
                <LinearGradient colors={['#005ecb', '#0A84FF']} style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                        <View>
                            <Text style={styles.headerTitle}>Aqua Services</Text>
                            <Text style={styles.headerSubtitle}>Controle e Economia na palma da mão</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* CORPO BRANCO ARREDONDADO */}
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                    <Surface style={styles.formSheet}>
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            
                            <View style={styles.authSwitchContainer}>
                                <TouchableOpacity onPress={() => handleFormTypeChange('login')} style={[styles.authTab, formType === 'login' && styles.authTabActive]}>
                                    <Text style={[styles.authTabText, formType === 'login' && styles.authTabTextActive]}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFormTypeChange('register')} style={[styles.authTab, formType === 'register' && styles.authTabActive]}>
                                    <Text style={[styles.authTabText, formType === 'register' && styles.authTabTextActive]}>Cadastro</Text>
                                </TouchableOpacity>
                            </View>

                            {formType === 'login' ? (
                                <View style={styles.formSection}>
                                    <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
                                    <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="email-outline" color="#999"/>} />
                                    <CustomInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry={!passwordVisible} left={<TextInput.Icon icon="lock-outline" color="#999"/>} right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)}/>} />
                                    
                                    <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)} style={styles.forgotPassContainer}>
                                        <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
                                    </TouchableOpacity>

                                    <GradientButton onPress={handleLogin} loading={isLoading}>ENTRAR</GradientButton>
                                </View>
                            ) : (
                                <View style={styles.formSection}>
                                    <Text style={styles.welcomeText}>Crie sua conta</Text>
                                    
                                    {/* SELETOR DE TIPO DE CADASTRO */}
                                    <View style={styles.typeSelector}>
                                        <TouchableOpacity onPress={() => setRegistrationType('casa')} style={[styles.typeOption, registrationType === 'casa' && styles.typeOptionActive]}>
                                            <Icon source="home-variant" size={24} color={registrationType === 'casa' ? '#FFF' : theme.colors.primary} />
                                            <Text style={[styles.typeText, registrationType === 'casa' && styles.typeTextActive]}>Casa</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setRegistrationType('condominio')} style={[styles.typeOption, registrationType === 'condominio' && styles.typeOptionActive]}>
                                            <Icon source="office-building" size={24} color={registrationType === 'condominio' ? '#FFF' : theme.colors.primary} />
                                            <Text style={[styles.typeText, registrationType === 'condominio' && styles.typeTextActive]}>Condomínio</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <CustomInput label="Nome Completo" value={name} onChangeText={setName} left={<TextInput.Icon icon="account-outline" color="#999"/>}/>
                                    <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="email-outline" color="#999"/>}/>
                                    <CustomInput label="CPF" value={cpf} onChangeText={text => setCpf(mask(text, '999.999.999-99'))} keyboardType="numeric" left={<TextInput.Icon icon="card-account-details-outline" color="#999"/>}/>
                                    <CustomInput label="Senha (min 6)" value={senha} onChangeText={setSenha} secureTextEntry left={<TextInput.Icon icon="lock-outline" color="#999"/>}/>

                                    {registrationType === 'casa' && (
                                        <>
                                            <View style={styles.rowInputs}>
                                                <CustomInput label="CEP" value={cep} onChangeText={text => setCep(mask(text, '99999-999'))} onBlur={() => fetchAddressFromCep(cep)} keyboardType="numeric" style={[styles.input, {flex: 1, marginRight: 8}]} />
                                                <CustomInput label="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" style={[styles.input, {flex: 1}]} />
                                            </View>
                                            <CustomInput label="Endereço" value={logradouro} disabled style={{backgroundColor: '#F0F0F0', marginBottom: 12}} />
                                            <View style={styles.rowInputs}>
                                                <CustomInput label="Bairro" value={bairro} disabled style={{backgroundColor: '#F0F0F0', flex: 1, marginRight: 8, marginBottom: 12}} />
                                                <CustomInput label="Cidade" value={cidade} disabled style={{backgroundColor: '#F0F0F0', flex: 1, marginBottom: 12}} />
                                            </View>
                                        </>
                                    )}

                                    {registrationType === 'condominio' && (
                                        <>
                                            <CustomInput label="Código de Acesso" value={codigoAcesso} onChangeText={setCodigoAcesso} left={<TextInput.Icon icon="key-outline" color="#999"/>}/>
                                            <View style={styles.rowInputs}>
                                                <CustomInput label="Bloco" value={bloco} onChangeText={setBloco} style={[styles.input, {flex: 1, marginRight: 8}]} />
                                                <CustomInput label="Apto" value={numero} onChangeText={setNumero} keyboardType="numeric" style={[styles.input, {flex: 1}]} />
                                            </View>
                                            <TouchableOpacity onPress={() => setCodigoDialogVisible(true)}>
                                                <Text style={styles.helpLink}>Onde encontro o código?</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    <CustomInput label="Moradores" value={numeroMoradores} onChangeText={setNumeroMoradores} keyboardType="numeric" left={<TextInput.Icon icon="account-group-outline" color="#999"/>}/>

                                    <View style={styles.termsContainer}>
                                        <Checkbox.Android status={agreeToTerms ? 'checked' : 'unchecked'} onPress={() => setAgreeToTerms(!agreeToTerms)} color={theme.colors.primary} />
                                        <TouchableOpacity onPress={() => setTermsVisible(true)}>
                                            <Text style={styles.termsTextLabel}>Li e aceito os <Text style={styles.termsLink}>Termos de Uso</Text></Text>
                                        </TouchableOpacity>
                                    </View>

                                    <GradientButton onPress={handleRegister} loading={isLoading} disabled={!agreeToTerms}>CADASTRAR</GradientButton>
                                </View>
                            )}
                            
                            <View style={{height: 40}} /> 
                        </ScrollView>
                    </Surface>
                </KeyboardAvoidingView>

                {/* --- MODAIS --- */}
                <Portal>
                    {/* Modal Termos */}
                    <Modal visible={termsVisible} onDismiss={() => setTermsVisible(false)} contentContainerStyle={styles.modalBox}>
                        <Title style={styles.modalTitle}>Termos de Uso</Title>
                        <Divider />
                        <ScrollView style={{maxHeight: 300, marginVertical: 15}} onScroll={({nativeEvent}) => {if(isCloseToBottom(nativeEvent)) setScrolledToBottom(true)}}>
                            <Paragraph style={{textAlign: 'justify'}}>
                                1. O Aqua é um serviço de monitoramento... (Texto completo aqui) {"\n\n"}
                                2. Seus dados são protegidos... {"\n\n"}
                                3. Ao usar, você concorda... {"\n\n"}
                                (Role até o fim para aceitar)
                            </Paragraph>
                        </ScrollView>
                        <Button mode="contained" onPress={handleAcceptTerms} disabled={!scrolledToBottom} style={{marginTop: 10}}>
                            {scrolledToBottom ? "Aceitar Termos" : "Role até o fim"}
                        </Button>
                    </Modal>

                    {/* Dialogs informativos */}
                    <Dialog visible={codigoDialogVisible} onDismiss={() => setCodigoDialogVisible(false)} style={{borderRadius: 16}}>
                        <Dialog.Title>Código de Acesso</Dialog.Title>
                        <Dialog.Content><Paragraph>Este código é fornecido pela administração do seu condomínio.</Paragraph></Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setCodigoDialogVisible(false)}>Entendi</Button></Dialog.Actions>
                    </Dialog>

                    <Dialog visible={planoIndividualDialog} onDismiss={() => setPlanoIndividualDialog(false)}>
                        <Dialog.Title>Residência Própria</Dialog.Title>
                        <Dialog.Content><Paragraph>Para casas que possuem seu próprio hidrômetro independente.</Paragraph></Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setPlanoIndividualDialog(false)}>Ok</Button></Dialog.Actions>
                    </Dialog>

                    <Dialog visible={planoCondoDialog} onDismiss={() => setPlanoCondoDialog(false)}>
                        <Dialog.Title>Plano Condomínio</Dialog.Title>
                        <Dialog.Content><Paragraph>Para apartamentos ou casas dentro de condomínios parceiros.</Paragraph></Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setPlanoCondoDialog(false)}>Ok</Button></Dialog.Actions>
                    </Dialog>

                    {/* Esqueci Senha */}
                    <Modal visible={forgotPasswordModalVisible} onDismiss={() => setForgotPasswordModalVisible(false)} contentContainerStyle={styles.modalBoxSmall}>
                        <Title style={styles.modalTitleCenter}>Recuperar Senha</Title>
                        <TextInput mode="outlined" label="Seu e-mail" value={resetEmail} onChangeText={setResetEmail} style={{marginBottom: 15}} />
                        <Button mode="contained" onPress={handleForgotPasswordRequest} loading={isLoading}>Enviar Código</Button>
                    </Modal>

                    {/* Resetar Senha */}
                    <Modal visible={resetPasswordModalVisible} onDismiss={() => setResetPasswordModalVisible(false)} contentContainerStyle={styles.modalBoxSmall}>
                        <Title style={styles.modalTitleCenter}>Nova Senha</Title>
                        <TextInput mode="outlined" label="Código (6 dígitos)" value={resetToken} onChangeText={setResetToken} keyboardType="numeric" style={{marginBottom: 10}} />
                        <TextInput mode="outlined" label="Nova Senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={{marginBottom: 10}} />
                        <TextInput mode="outlined" label="Confirmar Senha" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry style={{marginBottom: 15}} />
                        <Button mode="contained" onPress={handleResetPasswordSubmit} loading={isLoading}>Salvar</Button>
                    </Modal>
                </Portal>

                <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({...snackbar, visible:false})} duration={3000} style={{backgroundColor: snackbar.type === 'error' ? '#FF3B30' : '#34C759'}}>
                    {snackbar.message}
                </Snackbar>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#0A84FF' },
    
    // HEADER
    headerContainer: { height: height * 0.35, paddingTop: 40, paddingHorizontal: 20, justifyContent: 'center' },
    headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logo: { width: 80, height: 80, marginRight: 15, tintColor: '#FFF' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5, maxWidth: 200 },

    // CORPO (Form Sheet)
    keyboardView: { flex: 1 },
    formSheet: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: -30, // Puxa para cima do header
    },
    scrollContent: { paddingHorizontal: 24, paddingTop: 24 },

    // TABS (Login/Cadastro)
    authSwitchContainer: { flexDirection: 'row', marginBottom: 24, backgroundColor: '#F2F2F7', borderRadius: 12, padding: 4 },
    authTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    authTabActive: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 },
    authTabText: { fontWeight: '600', color: '#8E8E93' },
    authTabTextActive: { color: theme.colors.primary },

    // FORMULÁRIO
    formSection: { marginTop: 10 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    input: { marginBottom: 12, backgroundColor: '#FAFAFA', fontSize: 15 },
    
    // SELETOR TIPO (Casa/Condo)
    typeSelector: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    typeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: '#FFF' },
    typeOptionActive: { backgroundColor: theme.colors.primary },
    typeText: { marginLeft: 8, fontWeight: '600', color: theme.colors.primary },
    typeTextActive: { color: '#FFF' },

    rowInputs: { flexDirection: 'row' },
    
    // BOTÕES E LINKS
    forgotPassContainer: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotPassText: { color: theme.colors.primary, fontWeight: '600' },
    helpLink: { color: theme.colors.primary, textAlign: 'center', marginBottom: 15, fontSize: 12, textDecorationLine: 'underline' },
    
    btnContainer: { borderRadius: 12, overflow: 'hidden', marginTop: 10, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.3 },
    btnGradient: { paddingVertical: 16, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' },
    termsTextLabel: { color: '#666', fontSize: 13 },
    termsLink: { color: theme.colors.primary, fontWeight: 'bold' },

    // MODAIS
    modalBox: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 16, maxHeight: '80%' },
    modalBoxSmall: { backgroundColor: '#FFF', margin: 30, padding: 25, borderRadius: 16 },
    modalTitle: { textAlign: 'center', marginBottom: 10 },
    modalTitleCenter: { textAlign: 'center', marginBottom: 20, color: theme.colors.primary },
});