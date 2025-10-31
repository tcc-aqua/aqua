import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
    SegmentedButtons,
    Portal,
    Dialog,
    HelperText,
    Avatar,
    Checkbox,
    Snackbar
} from 'react-native-paper';
import { mask } from 'react-native-mask-text';

// URL base da sua API backend
const API_BASE_URL = 'http://192.168.56.1:3334';

// Tema visual do Paper
const theme = {
    ...DefaultTheme,
    roundness: 12,
    colors: {
        ...DefaultTheme.colors,
        primary: '#007BFF',
        accent: '#0056b3',
        background: '#F0F8FF',
        surface: '#FFFFFF',
        text: '#333333',
        placeholder: '#888888',
        error: '#B00020',
    },
};

export default function LoginRegisterScreen({ onLogin: onSuccessfulLogin }) {
    // --- CONTROLE DE ESTADO DA TELA ---
    const [formType, setFormType] = useState('login');
    const [registrationType, setRegistrationType] = useState('casa');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // --- ESTADOS UNIFICADOS PARA OS CAMPOS DO FORMULÁRIO ---
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

    // --- FUNÇÕES AUXILIARES ---
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };
    
    // --- FUNÇÕES DE LÓGICA E API ---

    // A função agora retorna os dados do endereço para uso posterior.
    const fetchAddressFromCep = async (cepValue) => {
        const unmaskedCep = cepValue.replace(/\D/g, '');
        if (unmaskedCep.length !== 8) return null;
        
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cep/${unmaskedCep}`);
            const addressData = response.data;
            
            // Atualiza os estados para a UI refletir as mudanças.
            setLogradouro(addressData.logradouro || '');
            setBairro(addressData.bairro || '');
            setCidade(addressData.localidade || '');
            setUf(addressData.uf || '');
            setEstado(addressData.estado || '');

            // Retorna os dados para serem usados na lógica de registro.
            return {
                logradouro: addressData.logradouro,
                bairro: addressData.bairro,
                cidade: addressData.localidade,
                uf: addressData.uf,
                estado: addressData.estado
            };
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            showSnackbar('CEP não encontrado ou inválido.');
            setLogradouro('');
            setBairro('');
            setCidade('');
            setUf('');
            setEstado('');
            return null; // Retorna null em caso de erro.
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            showSnackbar('Por favor, preencha e-mail e senha.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password: senha });
            const { token, user } = response.data;
            await AsyncStorage.setItem('token', token);
            showSnackbar('Login realizado com sucesso!');
            onSuccessfulLogin(user);
        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
            showSnackbar(`Erro: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);
        
        const residenciaType = registrationType === 'condominio' ? 'apartamento' : 'casa';
        let userData = {
            name,
            email,
            password: senha,
            cpf,
            residencia_type: residenciaType,
            numero_moradores: parseInt(numeroMoradores, 10) || 1,
        };

        // --- LÓGICA CORRIGIDA PARA GARANTIR OS DADOS DE ENDEREÇO ---
        if (residenciaType === 'casa') {
            // Re-busca os dados do CEP no momento do clique para garantir que estão atualizados.
            const addressData = await fetchAddressFromCep(cep);

            // Se a busca de CEP falhar ou os dados essenciais não vierem, mostra um erro e para.
            if (!addressData || !addressData.logradouro || !addressData.cidade) {
                showSnackbar('Endereço inválido. Verifique o CEP e tente novamente.');
                setIsLoading(false);
                return; // Para a execução do cadastro.
            }
            
            // Adiciona os dados de endereço e casa ao objeto userData.
            Object.assign(userData, {
                ...addressData,
                cep: cep.replace(/\D/g, ''),
                numero,
            });
        } 
        else { // Para apartamento
            Object.assign(userData, {
                codigo_acesso: codigoAcesso,
                bloco,
                numero,
            });
        }
        
        // Com o userData garantidamente completo, envia a requisição de registro.
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
            showSnackbar('Cadastro realizado com sucesso! Faça o login.');
            setFormType('login');
        } catch (error) {
            console.error("Detalhes do erro de cadastro:", error.response?.data || error);
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.map(e => e.message).join('\n');
                showSnackbar(`Erros de validação:\n${errorMessages}`);
            } else if (error.response?.data?.error) {
                showSnackbar(`Erro: ${error.response.data.error}`);
            } else {
                showSnackbar('Não foi possível conectar ao servidor.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDERIZAÇÃO DOS FORMULÁRIOS ---
    const renderLoginForm = () => (
        <>
            <Paragraph style={styles.paragraph}>Bem-vindo! Faça login para continuar.</Paragraph>
            <TextInput 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                style={styles.input} 
                mode="outlined" 
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="account-circle-outline" />} 
            />
            <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!passwordVisible}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="lock-outline" />}
                right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />}
            />
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.mainButton} 
                labelStyle={styles.mainButtonText} 
                icon="login-variant" 
                loading={isLoading} 
                disabled={isLoading}
            >
                {isLoading ? 'Entrando...' : 'Login'}
            </Button>
            <Button mode="text" onPress={() => setFormType('register')} style={styles.switchButton}>
                Novo por aqui? Crie uma conta
            </Button>
        </>
    );

    const renderRegisterForm = () => (
        <>
            <Paragraph style={styles.paragraph}>Crie sua conta para começar.</Paragraph>
            <SegmentedButtons
                value={registrationType}
                onValueChange={setRegistrationType}
                style={styles.segmentedButtons}
                buttons={[
                    { value: 'casa', label: 'Casa', icon: 'home-variant-outline' },
                    { value: 'condominio', label: 'Condomínio', icon: 'office-building-outline' },
                ]}
            />
            <TextInput label="Nome Completo" style={styles.input} value={name} onChangeText={setName} mode="outlined" />
            <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none"/>
            <TextInput label="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry mode="outlined" />
            <TextInput 
                label="CPF" 
                style={styles.input} 
                value={cpf} 
                onChangeText={(text) => setCpf(mask(text, '999.999.999-99'))} 
                mode="outlined" 
                keyboardType="numeric" 
            />
            
            {registrationType === 'casa' && (
                <>
                    <TextInput 
                        label="CEP" 
                        style={styles.input} 
                        value={cep} 
                        onChangeText={(text) => setCep(mask(text, '99999-999'))} 
                        onBlur={() => fetchAddressFromCep(cep)}
                        mode="outlined" 
                        keyboardType="numeric" 
                    />
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
                    <TextInput label="Número do Apartamento" style={styles.input} value={numero} onChangeText={setNumero} mode="outlined" keyboardType="numeric" />
                    <TextInput label="Número de Moradores" style={styles.input} value={numeroMoradores} onChangeText={setNumeroMoradores} mode="outlined" keyboardType="numeric" />
                    <HelperText type="info" visible={true} style={{ textAlign: 'center' }}>
                        Não sabe o código? <Button mode="text" compact onPress={showDialog} labelStyle={{ fontSize: 12 }}>Clique aqui</Button>
                    </HelperText>
                </>
            )}

            <Checkbox.Item
                label="Eu li e aceito os Termos e Condições"
                status={agreeToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                labelStyle={{ fontSize: 14, color: theme.colors.placeholder }}
                style={styles.checkbox}
            />
            <Button 
                mode="contained" 
                onPress={handleRegister} 
                style={styles.mainButton} 
                labelStyle={styles.mainButtonText} 
                icon="account-plus-outline" 
                loading={isLoading} 
                disabled={isLoading || !agreeToTerms}
            >
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <Button mode="text" onPress={() => setFormType('login')} style={styles.switchButton}>
                Já tem uma conta? Faça login
            </Button>
        </>
    );

    // --- ESTRUTURA PRINCIPAL DO COMPONENTE ---
    return (
        <PaperProvider theme={theme}>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Icon icon="information-outline" size={48} color={theme.colors.primary} />
                    <Dialog.Title style={{ textAlign: 'center' }}>Código de Acesso</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>O código de acesso do condomínio é um identificador único. Você pode encontrá-lo na sua fatura ou consultar a administração do condomínio.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} mode="contained">Entendi</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.logoContainer}>
                                <Avatar.Image size={80} source={require('../assets/aqua-logo.png')} style={{ backgroundColor: 'transparent' }} />
                                <Title style={styles.title}>Aqua Services 2025</Title>
                            </View>
                            {formType === 'login' ? renderLoginForm() : renderRegisterForm()}
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={Snackbar.DURATION_LONG}
                style={{ backgroundColor: snackbarMessage.startsWith('Erro') ? theme.colors.error : '#323232' }}
            >
                {snackbarMessage}
            </Snackbar>
        </PaperProvider>
    );
}

// --- ESTILOS DO COMPONENTE ---
const styles = StyleSheet.create({
    scrollContainer: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        backgroundColor: theme.colors.background 
    },
    container: { 
        padding: 20 
    },
    card: { 
        width: '100%', 
        maxWidth: 420, 
        alignSelf: 'center', 
        paddingVertical: 8 
    },
    logoContainer: { 
        alignItems: 'center', 
        marginBottom: 16 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: theme.colors.primary, 
        marginTop: 8 
    },
    paragraph: { 
        fontSize: 16, 
        color: theme.colors.placeholder, 
        textAlign: 'center', 
        marginBottom: 20, 
    },
    input: { 
        marginBottom: 12 
    },
    mainButton: { 
        marginTop: 16, 
        paddingVertical: 8 
    },
    mainButtonText: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    switchButton: { 
        marginTop: 12 
    },
    segmentedButtons: { 
        marginBottom: 20 
    },
    checkbox: { 
        backgroundColor: theme.colors.surface, 
        marginTop: 10, 
        borderRadius: theme.roundness 
    },
});