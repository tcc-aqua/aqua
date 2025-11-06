import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    ScrollView, 
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    LayoutAnimation,
    UIManager
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    TextInput,
    Button,
    Card,
    Title,
    Paragraph,
    Provider as PaperProvider,
    DefaultTheme,
    Portal,
    Dialog,
    HelperText,
    Avatar,
    Checkbox,
    Snackbar,
    Text,
    Modal,
    Divider,
    Subheading,
    IconButton,
    Icon
} from 'react-native-paper';
import { mask } from 'react-native-mask-text';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const API_BASE_URL = 'http://192.168.56.1:3334';

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0A84FF',
        accent: '#005ecb',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        text: '#1C1C1E',
        placeholder: '#8A8A8E',
        error: '#FF3B30',
        success: '#34C759'
    },
};

export default function LoginRegisterScreen({ onLogin: onSuccessfulLogin }) {
    const [formType, setFormType] = useState('login');
    const [registrationType, setRegistrationType] = useState('casa');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'default' });

    const [codigoDialogVisible, setCodigoDialogVisible] = useState(false);
    const [planoIndividualDialog, setPlanoIndividualDialog] = useState(false);
    const [planoCondoDialog, setPlanoCondoDialog] = useState(false);

    const [termsVisible, setTermsVisible] = useState(false);
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
    const [estado, setEstado] = useState('');
    const [codigoAcesso, setCodigoAcesso] = useState('');
    const [bloco, setBloco] = useState('');
    const [numeroMoradores, setNumeroMoradores] = useState('1');
    
    const showSnackbar = (message, type = 'default') => {
        setSnackbar({ visible: true, message, type });
    };

    const clearFormFields = () => {
        setName(''); setEmail(''); setSenha(''); setCpf(''); setCep('');
        setLogradouro(''); setNumero(''); setBairro(''); setCidade('');
        setUf(''); setEstado(''); setCodigoAcesso(''); setBloco('');
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
            setCidade(addressData.localidade || ''); setUf(addressData.uf || ''); setEstado(addressData.estado || '');
            return { logradouro: addressData.logradouro, bairro: addressData.bairro, cidade: addressData.localidade, uf: addressData.uf, estado: addressData.estado };
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            showSnackbar('CEP não encontrado ou inválido.', 'error');
            setLogradouro(''); setBairro(''); setCidade(''); setUf(''); setEstado('');
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
            console.error("Erro no login:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
            showSnackbar(`Erro: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !senha.trim() || !cpf.trim()) { showSnackbar('Preencha todos os campos obrigatórios.', 'error'); return; }
        if (!email.includes('@') || !email.includes('.')) { showSnackbar('Formato de e-mail inválido.', 'error'); return; }
        if (senha.length < 6) { showSnackbar('A senha deve ter no mínimo 6 caracteres.', 'error'); return; }
        if (cpf.replace(/\D/g, '').length !== 11) { showSnackbar('CPF inválido.', 'error'); return; }
        if (registrationType === 'casa' && (!cep.trim() || !numero.trim())) { showSnackbar('Para residência própria, CEP e Número são obrigatórios.', 'error'); return; }
        if (registrationType === 'condominio' && (!codigoAcesso.trim() || !numero.trim())) { showSnackbar('Para plano condomínio, Código de Acesso e Número são obrigatórios.', 'error'); return; }
        if (!agreeToTerms) { showSnackbar('Você precisa aceitar os Termos e Condições para continuar.', 'error'); return; }

        setIsLoading(true);
        
        const residenciaType = registrationType === 'condominio' ? 'apartamento' : 'casa';
        let userData = { name, email, password: senha, cpf, residencia_type: residenciaType, numero_moradores: parseInt(numeroMoradores, 10) || 1 };

        if (residenciaType === 'casa') {
            Object.assign(userData, { logradouro, bairro, cidade, uf, estado, cep: cep.replace(/\D/g, ''), numero });
        } else {
            Object.assign(userData, { codigo_acesso: codigoAcesso, bloco, numero });
        }
        
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
            showSnackbar('Cadastro realizado com sucesso! Faça o login.', 'success');
            handleFormTypeChange('login');
        } catch (error) {
            console.error("Detalhes do erro de cadastro:", error.response?.data || error);
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.map(e => e.message).join('\n');
                showSnackbar(`Erros de validação:\n${errorMessages}`, 'error');
            } else if (error.response?.data?.error) {
                showSnackbar(`Erro: ${error.response.data.error}`, 'error');
            } else {
                showSnackbar('Não foi possível conectar ao servidor.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenTerms = () => setTermsVisible(true);
    const handleCloseTerms = () => setTermsVisible(false);
    const handleAcceptTerms = () => { setAgreeToTerms(true); handleCloseTerms(); };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const GradientButton = ({ onPress, loading, disabled, children }) => (
        <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={styles.gradientButtonContainer}>
            <LinearGradient colors={disabled ? ['#B0B0B0', '#C0C0C0'] : ['#0A84FF', '#005ecb']} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.gradientButtonText}>{loading ? 'Aguarde...' : children}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderLoginForm = () => (
        <View>
            <Paragraph style={styles.paragraph}>Bem-vindo! Faça login para continuar.</Paragraph>
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="account-circle-outline" />} />
            <TextInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry={!passwordVisible} style={styles.input} mode="outlined" left={<TextInput.Icon icon="lock-outline" />} right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />} />
            <Button mode="text" onPress={() => showSnackbar('Funcionalidade "Esqueci a Senha" em desenvolvimento.', 'default')} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                Esqueci minha senha
            </Button>
            <GradientButton onPress={handleLogin} loading={isLoading} disabled={isLoading}>
                Login
            </GradientButton>
            <Button mode="text" onPress={() => handleFormTypeChange('register')} style={styles.switchButton}>
                Novo por aqui? Crie uma conta
            </Button>
        </View>
    );

    const renderRegisterForm = () => (
        <View>
            <Paragraph style={styles.paragraph}>Selecione o tipo de plano para começar.</Paragraph>
            <View style={styles.customSegmentedContainer}>
                <TouchableOpacity 
                    style={[styles.customSegmentButton, registrationType === 'casa' && styles.customSegmentButtonActive]}
                    onPress={() => setRegistrationType('casa')}
                >
                    <Icon source="home-variant-outline" size={20} color={registrationType === 'casa' ? '#FFFFFF' : theme.colors.primary} />
                    <Text style={[styles.customSegmentLabel, registrationType === 'casa' && styles.customSegmentLabelActive]}>
                        Residência Própria
                    </Text>
                    <IconButton 
                        icon="help-circle-outline" 
                        size={20} 
                        iconColor={registrationType === 'casa' ? '#FFFFFF' : theme.colors.primary}
                        onPress={() => setPlanoIndividualDialog(true)}
                        style={styles.infoIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.customSegmentButton, registrationType === 'condominio' && styles.customSegmentButtonActive]}
                    onPress={() => setRegistrationType('condominio')}
                >
                    <Icon source="office-building-outline" size={20} color={registrationType === 'condominio' ? '#FFFFFF' : theme.colors.primary} />
                    <Text style={[styles.customSegmentLabel, registrationType === 'condominio' && styles.customSegmentLabelActive]}>
                        Plano Condomínio
                    </Text>
                    <IconButton 
                        icon="help-circle-outline" 
                        size={20} 
                        iconColor={registrationType === 'condominio' ? '#FFFFFF' : theme.colors.primary}
                        onPress={() => setPlanoCondoDialog(true)}
                        style={styles.infoIcon}
                    />
                </TouchableOpacity>
            </View>

            <TextInput label="Nome Completo" style={styles.input} value={name} onChangeText={setName} mode="outlined" />
            <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none"/>
            <TextInput label="Senha (mín. 6 caracteres)" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry mode="outlined" />
            <TextInput label="CPF" style={styles.input} value={cpf} onChangeText={(text) => setCpf(mask(text, '999.999.999-99'))} mode="outlined" keyboardType="numeric" />
            
            {registrationType === 'casa' && (
                <>
                    <TextInput label="CEP" style={styles.input} value={cep} onChangeText={(text) => setCep(mask(text, '99999-999'))} onBlur={() => fetchAddressFromCep(cep)} mode="outlined" keyboardType="numeric" />
                    <TextInput label="Logradouro" style={styles.input} value={logradouro} onChangeText={setLogradouro} mode="outlined" disabled={isLoading} />
                    <TextInput label="Bairro" style={styles.input} value={bairro} onChangeText={setBairro} mode="outlined" disabled={isLoading} />
                    <TextInput label="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} mode="outlined" disabled={isLoading} />
                    <TextInput label="UF" style={styles.input} value={uf} onChangeText={setUf} mode="outlined" disabled={isLoading} />
                    <TextInput label="Número da Casa" style={styles.input} value={numero} onChangeText={setNumero} mode="outlined" keyboardType="numeric" />
                    <TextInput label="Número de Moradores" style={styles.input} value={numeroMoradores} onChangeText={setNumeroMoradores} mode="outlined" keyboardType="numeric" />
                </>
            )}

            {registrationType === 'condominio' && (
                <>
                    <TextInput label="Código de Acesso do Condomínio" style={styles.input} value={codigoAcesso} onChangeText={setCodigoAcesso} mode="outlined" />
                    <TextInput label="Bloco" style={styles.input} value={bloco} onChangeText={setBloco} mode="outlined" />
                    <TextInput label="Código de acesso do apartamento" style={styles.input} value={numero} onChangeText={setNumero} mode="outlined" keyboardType="numeric" />
                    <TextInput label="Número de Moradores" style={styles.input} value={numeroMoradores} onChangeText={setNumeroMoradores} mode="outlined" keyboardType="numeric" />
                    <HelperText type="info" visible={true} style={{ textAlign: 'center' }}>
                        Não sabe o código? <Button mode="text" compact onPress={() => setCodigoDialogVisible(true)} labelStyle={{ fontSize: 12 }}>Clique aqui</Button>
                    </HelperText>
                </>
            )}

            <TouchableOpacity onPress={handleOpenTerms} style={styles.checkboxContainer}>
                <Checkbox.Android status={agreeToTerms ? 'checked' : 'unchecked'} color={theme.colors.primary} />
                <Text style={styles.checkboxLabel}>Eu li e aceito os <Text style={styles.checkboxLink}>Termos e Condições</Text></Text>
            </TouchableOpacity>

            <GradientButton onPress={handleRegister} loading={isLoading} disabled={isLoading || !agreeToTerms}>
                Cadastrar
            </GradientButton>
            <Button mode="text" onPress={() => handleFormTypeChange('login')} style={styles.switchButton}>
                Já tem uma conta? Faça login
            </Button>
        </View>
    );

    return (
        <PaperProvider theme={theme}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.logoContainer}>
                                    {/* ATENÇÃO: Verifique se o caminho para sua logo está correto */}
                                    <Avatar.Image size={80} source={require('../assets/logo.png')} style={{ backgroundColor: 'transparent' }} />
                                    <Title style={styles.title}>Aqua Services</Title>
                                </View>
                                {formType === 'login' ? renderLoginForm() : renderRegisterForm()}
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Portal>
                <Modal visible={termsVisible} onDismiss={handleCloseTerms} contentContainerStyle={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Title style={styles.modalTitle}>Termos e Condições de Uso</Title>
                        <Paragraph style={styles.modalSubtitle}>Aqua Services</Paragraph>
                    </View>
                    <Divider />
                    <ScrollView style={styles.modalScrollView} onScroll={({ nativeEvent }) => { if (isCloseToBottom(nativeEvent)) { if (!scrolledToBottom) setScrolledToBottom(true); }}} scrollEventThrottle={400}>
                        <Paragraph style={styles.termsText}>Bem-vindo ao Aqua! Agradecemos por escolher nossa solução para o monitoramento inteligente do consumo de água. Antes de prosseguir, por favor, leia atentamente nossos Termos e Condições.</Paragraph>
                        <Subheading style={styles.termsSubheading}>1. O Serviço Aqua</Subheading>
                        <Paragraph style={styles.termsText}>O projeto Aqua consiste em um sistema de assinaturas para monitoramento de água em condomínios e residências individuais. Nossa plataforma é composta por um Aplicativo Android, voltado para moradores e síndicos, e um Dashboard Administrativo para nossa equipe interna. O objetivo é fornecer uma ferramenta centralizada para acompanhar o consumo estimado de água, criar metas de economia e facilitar a comunicação com nossos clientes.</Paragraph>
                        <Subheading style={styles.termsSubheading}>2. Cadastro e Conta do Usuário</Subheading>
                        <Paragraph style={styles.termsText}>Ao se cadastrar, você concorda em fornecer informações verdadeiras, precisas e completas, como nome, e-mail e CPF. Você é o único responsável pela segurança de sua senha e por todas as atividades que ocorrem em sua conta.</Paragraph>
                        <Subheading style={styles.termsSubheading}>3. Coleta e Uso de Dados</Subheading>
                        <Paragraph style={styles.termsText}>Para fornecer nossos serviços, coletamos dois tipos principais de dados:{"\n\n"}a) **Dados Pessoais:** Informações fornecidas durante o cadastro (nome, e-mail, CPF, endereço) são utilizadas para identificação, faturamento e comunicação.{"\n\n"}b) **Dados de Consumo:** Nossos sensores IOT coletam dados sobre o fluxo de água em sua residência. Esses dados são processados para gerar relatórios de consumo estimado, identificar possíveis vazamentos e auxiliar na criação de metas.{"\n\n"}Todos os dados são armazenados de forma segura em nossa infraestrutura na nuvem (AWS) e tratados com a máxima confidencialidade. Não compartilharemos seus dados pessoais com terceiros sem seu consentimento explícito, exceto quando exigido por lei.</Paragraph>
                        <Subheading style={styles.termsSubheading}>4. Propriedade Intelectual</Subheading>
                        <Paragraph style={styles.termsText}>Todo o conteúdo, design, código-fonte, e elementos visuais do aplicativo Aqua, incluindo nosso mascote "Pingo", são de propriedade exclusiva da equipe de desenvolvimento do projeto Aqua. É proibida a reprodução, cópia ou redistribuição de qualquer parte do serviço sem nossa permissão prévia por escrito.</Paragraph>
                        <Subheading style={styles.termsSubheading}>5. Limitação de Responsabilidade</Subheading>
                        <Paragraph style={styles.termsText}>O sistema Aqua fornece dados de consumo de forma **estimada** e para fins de monitoramento. Embora nos esforcemos para a máxima precisão, não nos responsabilizamos por discrepâncias entre os dados apresentados e sua fatura oficial de água. O serviço é uma ferramenta de apoio à gestão do consumo, e não substitui a verificação de profissionais qualificados para problemas hidráulicos.</Paragraph>
                        <Subheading style={styles.termsSubheading}>6. Agradecimentos</Subheading>
                        <Paragraph style={styles.termsText}>Este projeto foi desenvolvido como Trabalho de Conclusão de Curso por: Davi Rodrigues, Felipe Lopes, Davi Chagas, Ana Carollini e Thiago Henrique. Agradecemos por fazer parte desta jornada conosco.</Paragraph>
                    </ScrollView>
                    <Divider />
                    <View style={styles.modalFooter}>
                        <Button mode="contained" onPress={handleAcceptTerms} disabled={!scrolledToBottom} style={scrolledToBottom ? {} : { backgroundColor: theme.colors.placeholder }}>
                            {scrolledToBottom ? "Eu Li e Aceito os Termos" : "Role até o final para aceitar"}
                        </Button>
                    </View>
                </Modal>

                <Dialog visible={planoIndividualDialog} onDismiss={() => setPlanoIndividualDialog(false)} style={styles.dialog}>
                    <Dialog.Icon icon="home-variant-outline" size={48} color={theme.colors.primary} />
                    <Dialog.Title style={styles.dialogTitle}>Plano de Residência Própria</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.dialogParagraph}>Escolha esta opção se você mora em uma casa ou residência que não faz parte de um condomínio parceiro. O cadastro será feito diretamente com seu endereço.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setPlanoIndividualDialog(false)} mode="contained">Entendi</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={planoCondoDialog} onDismiss={() => setPlanoCondoDialog(false)} style={styles.dialog}>
                    <Dialog.Icon icon="office-building-outline" size={48} color={theme.colors.primary} />
                    <Dialog.Title style={styles.dialogTitle}>Plano Condomínio</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.dialogParagraph}>Escolha esta opção se você mora em um apartamento ou casa dentro de um condomínio que já possui o sistema Aqua. Você precisará do código de acesso fornecido pelo síndico.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setPlanoCondoDialog(false)} mode="contained">Entendi</Button>
                    </Dialog.Actions>
                </Dialog>
                
                <Dialog visible={codigoDialogVisible} onDismiss={() => setCodigoDialogVisible(false)} style={styles.dialog}>
                    <Dialog.Icon icon="information-outline" size={48} color={theme.colors.primary} />
                    <Dialog.Title style={styles.dialogTitle}>Código de Acesso</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.dialogParagraph}>O código de acesso do condomínio é um identificador único. Você pode encontrá-lo na sua fatura ou consultar a administração.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setCodigoDialogVisible(false)} mode="contained">Entendi</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={Snackbar.DURATION_MEDIUM}
                style={{ backgroundColor: snackbar.type === 'error' ? theme.colors.error : snackbar.type === 'success' ? theme.colors.success : '#323232' }}
            >
                {snackbar.message}
            </Snackbar>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: { flex: 1, backgroundColor: theme.colors.background },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
    container: { paddingHorizontal: 20 },
    card: { width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: theme.roundness * 1.5, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
    cardContent: { paddingHorizontal: 24, paddingVertical: 32 },
    logoContainer: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginTop: 12, letterSpacing: 0.5 },
    paragraph: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    input: { marginBottom: 16, backgroundColor: theme.colors.background },
    gradientButtonContainer: { marginTop: 8, borderRadius: theme.roundness * 5, elevation: 4, shadowColor: '#0A84FF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5 },
    gradientButton: { paddingVertical: 14, alignItems: 'center' },
    gradientButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 0.5 },
    switchButton: { marginTop: 16 },
    customSegmentedContainer: { flexDirection: 'row', marginBottom: 24, borderWidth: 1, borderColor: theme.colors.placeholder, borderRadius: theme.roundness, overflow: 'hidden' },
    customSegmentButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: theme.colors.surface, paddingHorizontal: 5, },
    customSegmentButtonActive: { backgroundColor: theme.colors.primary },
    customSegmentLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.primary, marginLeft: 6, flexShrink: 1, },
    customSegmentLabelActive: { color: '#FFFFFF' },
    infoIcon: { margin: -5 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'transparent', paddingVertical: 8 },
    checkboxLabel: { marginLeft: 6, color: theme.colors.placeholder, flex: 1 },
    checkboxLink: { fontWeight: 'bold', color: theme.colors.primary, textDecorationLine: 'underline' },
    dialog: { borderRadius: theme.roundness * 1.5 },
    dialogTitle: { textAlign: 'center', color: theme.colors.text },
    dialogParagraph: { textAlign: 'center', color: theme.colors.placeholder, lineHeight: 20 },
    modalContainer: { backgroundColor: 'white', margin: 20, borderRadius: theme.roundness * 1.5, height: '85%', elevation: 10 },
    modalHeader: { paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
    modalSubtitle: { fontSize: 14, color: theme.colors.placeholder },
    modalScrollView: { paddingHorizontal: 24 },
    termsText: { fontSize: 14, lineHeight: 22, marginBottom: 16, textAlign: 'justify', color: theme.colors.text },
    termsSubheading: { fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 8, color: theme.colors.text },
    modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
});