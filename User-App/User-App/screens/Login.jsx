import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    UIManager,
    Dimensions,
    Image,
    LayoutAnimation
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
    Checkbox,
    Snackbar,
    Text,
    Modal,
    Divider,
    Subheading,
    Icon
} from 'react-native-paper';
import { mask } from 'react-native-mask-text';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Lembrete: Se estiver no emulador Android use 'http://10.0.2.2:3334', 
// se for dispositivo físico use o IP da máquina (ex: 192.168.x.x:3334)
const API_BASE_URL = 'http://localhost:3334';

const theme = {
    ...DefaultTheme,
    roundness: 12,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0A84FF',
        accent: '#005ecb',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#1C1C1E',
        placeholder: '#A0A0A0',
        error: '#FF3B30',
        success: '#34C759'
    },
};

// Componente de Input Personalizado (Visual do Código 1)
const CustomInput = ({ style, ...props }) => (
    <View style={{ marginBottom: 16 }}> 
        <TextInput
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="#0A84FF"
            textColor="#1C1C1E"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, style]}
            theme={{ roundness: 12, colors: { background: '#F3F4F6', onSurfaceVariant: '#6B7280' }}}
            {...props}
        />
    </View>
);

// Componente de Botão Gradiente (Visual do Código 1)
const GradientButton = ({ onPress, loading, disabled, children }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.9} style={styles.btnContainer}>
        <LinearGradient colors={disabled ? ['#E0E0E0', '#E0E0E0'] : ['#0A84FF', '#005ecb']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.btnGradient}>
            {loading ? <Icon source="loading" size={24} color="#FFF" /> : <Text style={styles.btnText}>{children}</Text>}
        </LinearGradient>
    </TouchableOpacity>
);

export default function LoginRegisterScreen({ onLogin: onSuccessfulLogin }) {
    const [formType, setFormType] = useState('login');
    const [registrationType, setRegistrationType] = useState('casa');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'default' });

    // --- MODAIS E DIALOGS ---
    const [codigoDialogVisible, setCodigoDialogVisible] = useState(false);
    const [planoIndividualDialog, setPlanoIndividualDialog] = useState(false);
    const [planoCondoDialog, setPlanoCondoDialog] = useState(false);
    
    // --- TERMOS DE USO ---
    const [termsVisible, setTermsVisible] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    // --- DADOS DO FORMULÁRIO ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    
    // Endereço
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    
    const [codigoAcesso, setCodigoAcesso] = useState('');
    const [bloco, setBloco] = useState('');
    const [numeroMoradores, setNumeroMoradores] = useState('1');

    // --- RECUPERAÇÃO DE SENHA ---
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
        setNumeroMoradores('1'); setAgreeToTerms(false); setScrolledToBottom(false);
    };

    const handleFormTypeChange = (newType) => {
        // Funcionalidade do Código 2: Animação suave
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        clearFormFields();
        setFormType(newType);
    };

    // Funcionalidade do Código 2: Busca de CEP mais robusta
    const fetchAddressFromCep = async (cepValue) => {
        const unmaskedCep = cepValue.replace(/\D/g, '');
        if (unmaskedCep.length !== 8) return;
        
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cep/${unmaskedCep}`);
            const data = response.data;
            
            if (data) {
                setLogradouro(data.logradouro || '');
                setBairro(data.bairro || '');
                setCidade(data.cidade || '');
                setUf(data.uf || '');
            }
        } catch (error) { 
            console.error("Erro ao buscar CEP:", error);
            showSnackbar('CEP não encontrado ou inválido.', 'error');
            setLogradouro(''); setBairro(''); setCidade(''); setUf('');
        } 
        finally { setIsLoading(false); }
    };

    // Funcionalidade do Código 2: Login com tratamento de erros detalhado
    const handleLogin = async () => {
        if (!email || !senha) { showSnackbar('Preencha e-mail e senha.', 'error'); return; }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password: senha });
            const { token, user } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            showSnackbar('Login realizado com sucesso!', 'success');
            if(onSuccessfulLogin) onSuccessfulLogin(user);
        } catch (error) { 
            console.error("Erro no login:", error.response?.data || error.message);
            const msg = error.response?.data?.message || error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
            showSnackbar(msg, 'error'); 
        } 
        finally { setIsLoading(false); }
    };

    // Funcionalidade do Código 2: Cadastro com Validações Rigorosas
    const handleRegister = async () => {
        // Validações do Código 2
        if (!name.trim() || !email.trim() || !senha.trim() || !cpf.trim()) { showSnackbar('Preencha todos os campos.', 'error'); return; }
        if (!email.includes('@') || !email.includes('.')) { showSnackbar('Formato de e-mail inválido.', 'error'); return; }
        if (senha.length < 6) { showSnackbar('A senha deve ter no mínimo 6 caracteres.', 'error'); return; }
        if (cpf.replace(/\D/g, '').length !== 11) { showSnackbar('CPF inválido.', 'error'); return; }

        // Validações Específicas
        if (registrationType === 'casa' && (!cep || !numero || !logradouro)) { showSnackbar('Endereço completo é obrigatório.', 'error'); return; }
        if (registrationType === 'condominio' && (!codigoAcesso || !numero)) { showSnackbar('Código e Número são obrigatórios.', 'error'); return; }
        
        if (!agreeToTerms) { showSnackbar('Você precisa aceitar os Termos de Uso.', 'error'); return; }

        setIsLoading(true);
        
        const userData = {
            name, email, password: senha, cpf, 
            residencia_type: registrationType === 'condominio' ? 'apartamento' : 'casa',
            numero_moradores: parseInt(numeroMoradores, 10) || 1,
            cep, logradouro, bairro, cidade, uf, numero, bloco, 
            codigo_acesso: codigoAcesso
        };

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
            showSnackbar('Cadastro realizado! Faça login.', 'success');
            handleFormTypeChange('login');
        } catch (error) { 
            console.error("Detalhes do erro:", error.response?.data || error);
            
            // Tratamento de erro detalhado do Código 2
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.map(e => e.message).join('\n');
                showSnackbar(`Erros:\n${errorMessages}`, 'error');
            } else {
                const msg = error.response?.data?.message || error.response?.data?.error || 'Erro ao cadastrar';
                showSnackbar(msg, 'error'); 
            }
        } 
        finally { setIsLoading(false); }
    };

    // Funcionalidade do Código 2: Recuperação de Senha
    const handleForgotPasswordRequest = async () => {
        if (!resetEmail.includes('@') || !resetEmail.includes('.')) { showSnackbar('Digite um e-mail válido.', 'error'); return; }
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/password/forgot`, { email: resetEmail });
            showSnackbar('Código enviado! Verifique seu e-mail e spam.', 'success');
            setForgotPasswordModalVisible(false); setResetPasswordModalVisible(true);
        } catch (e) { 
            // Mesmo com erro, por segurança, muitas vezes avisamos que se o email existir foi enviado
            showSnackbar('Se o e-mail estiver correto, você receberá um código.', 'success'); 
            setForgotPasswordModalVisible(false); setResetPasswordModalVisible(true);
        } finally { setIsLoading(false); }
    };

    const handleResetPasswordSubmit = async () => {
        if (!resetToken || !newPassword) { showSnackbar('Preencha todos os campos.', 'error'); return; }
        if (newPassword !== confirmNewPassword) { showSnackbar('As senhas não coincidem.', 'error'); return; }
        if (newPassword.length < 6) { showSnackbar('A senha deve ter mín. 6 caracteres.', 'error'); return; }
        
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/password/reset`, { token: resetToken, newPassword });
            showSnackbar('Senha alterada com sucesso! Faça login.', 'success');
            setResetPasswordModalVisible(false);
            handleFormTypeChange('login');
        } catch (e) { 
            const msg = e.response?.data?.error || 'Erro ao alterar senha.';
            showSnackbar(msg, 'error'); 
        } finally { setIsLoading(false); }
    };

    const handleAcceptTerms = () => { 
        setAgreeToTerms(true); 
        setTermsVisible(false); 
    };

    // Funcionalidade do Código 2: Detecção de Scroll
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    return (
        <PaperProvider theme={theme}>
            <View style={styles.mainContainer}>
                {/* HEADER CURVO (Visual do Código 1) */}
                <View style={styles.headerWrapper}>
                    <LinearGradient colors={['#004aad', '#0A84FF']} style={styles.headerGradient}>
                        <View style={styles.headerContent}>
                            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                            <View>
                                <Text style={styles.headerTitle}>Aqua Services</Text>
                                <Text style={styles.headerSubtitle}>Gestão inteligente de água</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={styles.curveMask} />
                </View>

                {/* CONTEÚDO (FORMULÁRIO) */}
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        
                        {/* Alternador Login/Cadastro (Visual do Código 1) */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity onPress={() => handleFormTypeChange('login')} style={[styles.toggleBtn, formType === 'login' && styles.toggleBtnActive]}>
                                <Text style={[styles.toggleText, formType === 'login' && styles.toggleTextActive]}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleFormTypeChange('register')} style={[styles.toggleBtn, formType === 'register' && styles.toggleBtnActive]}>
                                <Text style={[styles.toggleText, formType === 'register' && styles.toggleTextActive]}>Cadastro</Text>
                            </TouchableOpacity>
                        </View>

                        {formType === 'login' ? (
                            <View style={styles.formBody}>
                                <Text style={styles.sectionTitle}>Bem-vindo de volta</Text>
                                <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="email-outline" color="#0A84FF"/>} />
                                <CustomInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry={!passwordVisible} left={<TextInput.Icon icon="lock-outline" color="#0A84FF"/>} right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)}/>} />
                                
                                <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)} style={{alignSelf: 'flex-end', marginBottom: 24}}>
                                    <Text style={{color: '#0A84FF', fontWeight: '600'}}>Esqueceu a senha?</Text>
                                </TouchableOpacity>

                                <GradientButton onPress={handleLogin} loading={isLoading}>ACESSAR CONTA</GradientButton>
                            </View>
                        ) : (
                            <View style={styles.formBody}>
                                <Text style={styles.sectionTitle}>Crie sua conta</Text>
                                <Text style={{color:'#666', marginBottom:15}}>Escolha o tipo de residência:</Text>
                                
                                {/* Tipos de Residência (Visual do Código 1) */}
                                <View style={styles.radioGroup}>
                                    <TouchableOpacity onPress={() => setRegistrationType('casa')} style={[styles.radioOption, registrationType === 'casa' && styles.radioActive]}>
                                        <Icon source="home-variant" size={24} color={registrationType === 'casa' ? '#FFF' : '#0A84FF'} />
                                        <Text style={[styles.radioText, registrationType === 'casa' && styles.radioTextActive]}>Casa Própria</Text>
                                        <TouchableOpacity style={{position:'absolute', top:5, right:5}} onPress={() => setPlanoIndividualDialog(true)}>
                                            <Icon source="help-circle-outline" size={18} color={registrationType === 'casa' ? '#FFF' : '#0A84FF'}/>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setRegistrationType('condominio')} style={[styles.radioOption, registrationType === 'condominio' && styles.radioActive]}>
                                        <Icon source="office-building" size={24} color={registrationType === 'condominio' ? '#FFF' : '#0A84FF'} />
                                        <Text style={[styles.radioText, registrationType === 'condominio' && styles.radioTextActive]}>Condomínio</Text>
                                        <TouchableOpacity style={{position:'absolute', top:5, right:5}} onPress={() => setPlanoCondoDialog(true)}>
                                            <Icon source="help-circle-outline" size={18} color={registrationType === 'condominio' ? '#FFF' : '#0A84FF'}/>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>

                                <CustomInput label="Nome Completo" value={name} onChangeText={setName} left={<TextInput.Icon icon="account" color="#0A84FF"/>} />
                                <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="email" color="#0A84FF"/>} />
                                <CustomInput label="CPF" value={cpf} onChangeText={t => setCpf(mask(t, '999.999.999-99'))} keyboardType="numeric" left={<TextInput.Icon icon="card-account-details" color="#0A84FF"/>} />
                                <CustomInput label="Senha (mín 6 caract.)" value={senha} onChangeText={setSenha} secureTextEntry left={<TextInput.Icon icon="lock" color="#0A84FF"/>} />

                                {registrationType === 'casa' ? (
                                    <>
                                        <View style={{flexDirection: 'row', gap: 10}}>
                                            <View style={{flex: 1}}>
                                                <CustomInput 
                                                    label="CEP" 
                                                    value={cep} 
                                                    onChangeText={t => setCep(mask(t, '99999-999'))} 
                                                    onBlur={() => fetchAddressFromCep(cep)} 
                                                    keyboardType="numeric" 
                                                />
                                            </View>
                                            <View style={{width: 100}}>
                                                <CustomInput 
                                                    label="Nº" 
                                                    value={numero} 
                                                    onChangeText={setNumero} 
                                                    keyboardType="numeric" 
                                                />
                                            </View>
                                        </View>

                                        <CustomInput label="Rua / Logradouro" value={logradouro} onChangeText={setLogradouro} />
                                        <CustomInput label="Bairro" value={bairro} onChangeText={setBairro} />
                                        
                                        <View style={{flexDirection: 'row', gap: 10}}>
                                            <View style={{flex: 1}}>
                                                <CustomInput label="Cidade" value={cidade} onChangeText={setCidade} />
                                            </View>
                                            <View style={{width: 80}}>
                                                <CustomInput label="UF" value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters"/>
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <CustomInput label="Código do Condomínio" value={codigoAcesso} onChangeText={setCodigoAcesso} left={<TextInput.Icon icon="key" color="#0A84FF"/>} />
                                        <View style={{flexDirection: 'row', gap: 10}}>
                                            <View style={{flex: 1}}><CustomInput label="Bloco (Opc)" value={bloco} onChangeText={setBloco} /></View>
                                            <View style={{flex: 1}}><CustomInput label="Nº Apto" value={numero} onChangeText={setNumero} keyboardType="numeric" /></View>
                                        </View>
                                        <TouchableOpacity onPress={() => setCodigoDialogVisible(true)}><Text style={{color: '#0A84FF', textAlign:'center', marginBottom:15, fontSize:12, textDecorationLine:'underline'}}>Não tenho o código</Text></TouchableOpacity>
                                    </>
                                )}

                                <CustomInput label="Total de Moradores" value={numeroMoradores} onChangeText={setNumeroMoradores} keyboardType="numeric" left={<TextInput.Icon icon="account-group" color="#0A84FF"/>} />

                                <View style={styles.termsBox}>
                                    <Checkbox.Android status={agreeToTerms ? 'checked' : 'unchecked'} onPress={() => setAgreeToTerms(!agreeToTerms)} color="#0A84FF" />
                                    <TouchableOpacity onPress={() => setTermsVisible(true)}><Text style={{color: '#555', flexShrink: 1}}>Li e aceito os <Text style={{fontWeight:'bold', color:'#0A84FF'}}>Termos e Condições de Uso</Text></Text></TouchableOpacity>
                                </View>

                                <GradientButton onPress={handleRegister} loading={isLoading} disabled={!agreeToTerms}>FINALIZAR CADASTRO</GradientButton>
                            </View>
                        )}
                        <View style={{height: 50}}/>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* MODAIS E POPUPS (Interface 1 com Textos do 2) */}
                <Portal>
                    {/* DIALOG: CODIGO */}
                    <Dialog visible={codigoDialogVisible} onDismiss={() => setCodigoDialogVisible(false)} style={{backgroundColor:'#FFF', borderRadius:16}}>
                        <Dialog.Icon icon="information-outline" size={40} color="#0A84FF"/>
                        <Dialog.Title style={{textAlign:'center', color:'#333'}}>Código de Acesso</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph style={{textAlign:'center', color:'#666'}}>
                                O código de acesso é um identificador único do seu condomínio. Você pode encontrá-lo na sua fatura de condomínio ou solicitá-lo ao síndico.
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setCodigoDialogVisible(false)}>Entendi</Button></Dialog.Actions>
                    </Dialog>

                    {/* DIALOG: PLANO CASA */}
                    <Dialog visible={planoIndividualDialog} onDismiss={() => setPlanoIndividualDialog(false)} style={{backgroundColor:'#FFF', borderRadius:16}}>
                        <Dialog.Icon icon="home-variant-outline" size={40} color="#0A84FF"/>
                        <Dialog.Title style={{textAlign:'center'}}>Residência Própria</Dialog.Title>
                        <Dialog.Content><Paragraph style={{textAlign:'center'}}>Escolha esta opção se você mora em uma casa ou residência que não faz parte de um condomínio parceiro. O cadastro será feito diretamente com seu endereço.</Paragraph></Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setPlanoIndividualDialog(false)}>Ok</Button></Dialog.Actions>
                    </Dialog>

                    {/* DIALOG: PLANO CONDO */}
                    <Dialog visible={planoCondoDialog} onDismiss={() => setPlanoCondoDialog(false)} style={{backgroundColor:'#FFF', borderRadius:16}}>
                        <Dialog.Icon icon="office-building-outline" size={40} color="#0A84FF"/>
                        <Dialog.Title style={{textAlign:'center'}}>Plano Condomínio</Dialog.Title>
                        <Dialog.Content><Paragraph style={{textAlign:'center'}}>Escolha esta opção se você mora em um apartamento ou casa dentro de um condomínio que já utiliza o sistema Aqua.</Paragraph></Dialog.Content>
                        <Dialog.Actions><Button onPress={() => setPlanoCondoDialog(false)}>Ok</Button></Dialog.Actions>
                    </Dialog>

                    {/* MODAL: TERMOS (Conteúdo rico do Código 2) */}
                    <Modal visible={termsVisible} onDismiss={() => setTermsVisible(false)} contentContainerStyle={styles.modalCard}>
                        <Title style={{textAlign:'center', marginBottom:10}}>Termos e Condições</Title>
                        <Divider style={{marginBottom:10}}/>
                        <ScrollView 
                            style={{maxHeight: 400}} 
                            onScroll={({ nativeEvent }) => { if (isCloseToBottom(nativeEvent)) { if (!scrolledToBottom) setScrolledToBottom(true); }}} 
                            scrollEventThrottle={400}
                        >
                            <Paragraph style={styles.termsText}>Bem-vindo ao Aqua! Agradecemos por escolher nossa solução para o monitoramento inteligente do consumo de água.</Paragraph>
                            
                            <Subheading style={styles.termsSubheading}>1. O Serviço Aqua</Subheading>
                            <Paragraph style={styles.termsText}>O projeto Aqua consiste em um sistema de assinaturas para monitoramento de água em condomínios e residências individuais. Nossa plataforma é composta por um Aplicativo Android, voltado para moradores e síndicos, e um Dashboard Administrativo para nossa equipe interna.</Paragraph>
                            
                            <Subheading style={styles.termsSubheading}>2. Cadastro e Conta</Subheading>
                            <Paragraph style={styles.termsText}>Ao se cadastrar, você concorda em fornecer informações verdadeiras, precisas e completas. Você é responsável pela segurança de sua senha.</Paragraph>
                            
                            <Subheading style={styles.termsSubheading}>3. Coleta de Dados</Subheading>
                            <Paragraph style={styles.termsText}>Coletamos dados pessoais para faturamento e dados de consumo via sensores IOT para gerar relatórios e metas.</Paragraph>

                            <Subheading style={styles.termsSubheading}>4. Responsabilidade</Subheading>
                            <Paragraph style={styles.termsText}>O sistema fornece dados estimados e não substitui a fatura oficial da concessionária.</Paragraph>
                        </ScrollView>
                        <Divider style={{marginTop:10}}/>
                        <Button mode="contained" onPress={handleAcceptTerms} disabled={!scrolledToBottom} style={{marginTop:15, backgroundColor: scrolledToBottom ? theme.colors.primary : '#999'}}>
                            {scrolledToBottom ? "Eu Li e Aceito os Termos" : "Role até o final para aceitar"}
                        </Button>
                    </Modal>

                    {/* MODAL: ESQUECI SENHA */}
                    <Modal visible={forgotPasswordModalVisible} onDismiss={() => setForgotPasswordModalVisible(false)} contentContainerStyle={styles.modalCardSmall}>
                        <Title style={{textAlign:'center', marginBottom:5}}>Recuperar Acesso</Title>
                        <Paragraph style={{textAlign:'center', marginBottom:20, color:'#666'}}>Digite seu e-mail para receber um código.</Paragraph>
                        <CustomInput label="Seu e-mail" value={resetEmail} onChangeText={setResetEmail} />
                        <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:10}}>
                            <Button onPress={() => setForgotPasswordModalVisible(false)} style={{marginRight:10}}>Cancelar</Button>
                            <Button mode="contained" onPress={handleForgotPasswordRequest} loading={isLoading}>Enviar</Button>
                        </View>
                    </Modal>

                    {/* MODAL: RESETAR SENHA */}
                    <Modal visible={resetPasswordModalVisible} onDismiss={() => setResetPasswordModalVisible(false)} contentContainerStyle={styles.modalCardSmall}>
                        <Title style={{textAlign:'center', marginBottom:5}}>Nova Senha</Title>
                        <Paragraph style={{textAlign:'center', marginBottom:20, color:'#666'}}>Insira o código recebido e a nova senha.</Paragraph>
                        <CustomInput label="Código (6 dígitos)" value={resetToken} onChangeText={setResetToken} keyboardType="numeric" maxLength={6}/>
                        <CustomInput label="Nova Senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                        <CustomInput label="Confirmar" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry />
                        <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:10}}>
                            <Button onPress={() => setResetPasswordModalVisible(false)} style={{marginRight:10}}>Cancelar</Button>
                            <Button mode="contained" onPress={handleResetPasswordSubmit} loading={isLoading}>Salvar Senha</Button>
                        </View>
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
    mainContainer: { flex: 1, backgroundColor: '#F9FAFB' },
    headerWrapper: { height: height * 0.32, backgroundColor: 'transparent', position: 'relative', zIndex: 1 },
    headerGradient: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 30 },
    headerContent: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 60, height: 60, tintColor: '#FFF', marginRight: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
    curveMask: {
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 30,
        backgroundColor: '#F9FAFB', borderTopLeftRadius: 30, borderTopRightRadius: 30
    },
    keyboardView: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 24 },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    toggleBtnActive: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2 },
    toggleText: { fontWeight: '600', color: '#6B7280' },
    toggleTextActive: { color: '#0A84FF' },
    formBody: { backgroundColor: '#F9FAFB' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
    input: { backgroundColor: '#F3F4F6', height: 56, fontSize: 16 },
    radioGroup: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    radioOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFF', position: 'relative' },
    radioActive: { backgroundColor: '#0A84FF', borderColor: '#0A84FF' },
    radioText: { marginLeft: 8, fontWeight: '600', color: '#374151' },
    radioTextActive: { color: '#FFF' },
    btnContainer: { borderRadius: 12, overflow: 'hidden', marginTop: 10, elevation: 4, shadowColor: '#0A84FF', shadowOpacity: 0.3, shadowOffset: {width:0, height:4} },
    btnGradient: { paddingVertical: 16, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
    termsBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    termsText: { fontSize: 14, lineHeight: 22, marginBottom: 15, textAlign: 'justify', color: '#333' },
    termsSubheading: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#0A84FF' },
    modalCard: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 16, maxHeight: '85%' },
    modalCardSmall: { backgroundColor: '#FFF', margin: 30, padding: 24, borderRadius: 16 }
});