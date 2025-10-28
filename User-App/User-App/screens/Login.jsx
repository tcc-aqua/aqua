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

// ALTERAÇÃO IMPORTANTE: Corrigido a URL para incluir o prefixo /api que provavelmente está configurado no seu backend.
const BACKEND_URL = 'http://10.0.2.2:3334/api/auth';

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
  const [formType, setFormType] = useState('login');
  const [registrationType, setRegistrationType] = useState('casa');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [numCondominio, setNumCondominio] = useState('');
  const [numero, setNumero] = useState('');

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, { email, password: senha });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      showSnackbar('Login realizado com sucesso!');
      onSuccessfulLogin(user);
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Erro ao conectar com o servidor.';
      showSnackbar(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const residenciaType = registrationType === 'condominio' ? 'apartamento' : 'casa';

      const userData = {
        name: name,
        email: email,
        password: senha,
        cpf: cpf,
        residencia_type: residenciaType,
      };

      if (residenciaType === 'casa') {
        userData.cep = cep;
        userData.numero = numero;
        userData.sensor_id = 1; // IMPORTANTE: Valor fixo para teste. Você precisa definir a lógica para obter isso.
      }

      if (residenciaType === 'apartamento') {
        userData.codigo_acesso = numCondominio;
        userData.numero = numero;
      }
      
      await axios.post(`${BACKEND_URL}/register`, userData);

      showSnackbar('Cadastro realizado com sucesso! Faça o login.');
      setFormType('login');

    } catch (error) {
      console.error("Detalhes do erro de cadastro:", error.response?.data || error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
        showSnackbar(`Erros de validação:\n${errorMessages}`);
      } else if (error.response?.data?.error) {
        showSnackbar(`Erro: ${error.response.data.error}`);
      } else if (error.response?.status === 404) {
        showSnackbar('Erro: Rota de cadastro não encontrada no servidor. Verifique a URL.');
      }
      else {
        showSnackbar('Erro ao conectar com o servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <Paragraph style={styles.paragraph}>Bem-vindo! Faça login para continuar.</Paragraph>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" left={<TextInput.Icon icon="account-circle-outline" />} />
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
      <Button mode="contained" onPress={handleLogin} style={styles.mainButton} labelStyle={styles.mainButtonText} icon="login-variant" loading={isLoading} disabled={isLoading}>
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
      <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" />
      <TextInput label="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry mode="outlined" />
      <TextInput label="CPF (000.000.000-00)" style={styles.input} value={cpf} onChangeText={setCpf} mode="outlined" keyboardType="numeric" />
      <TextInput label="Número de Telefone" style={styles.input} value={telefone} onChangeText={setTelefone} mode="outlined" keyboardType="phone-pad" />
      
      {registrationType === 'casa' && (
        <>
          <TextInput label="CEP" style={styles.input} value={cep} onChangeText={setCep} mode="outlined" keyboardType="numeric" />
          <TextInput label="Número da Casa" style={styles.input} value={numero} onChangeText={setNumero} mode="outlined" keyboardType="numeric" />
          <TextInput label="Cidade/Estado" style={styles.input} value={cidade} onChangeText={setCidade} mode="outlined" />
        </>
      )}

      {registrationType === 'condominio' && (
        <>
          <TextInput label="Código de Acesso do Condomínio" style={styles.input} value={numCondominio} onChangeText={setNumCondominio} mode="outlined" />
          <TextInput label="Número do Apartamento" style={styles.input} value={numero} onChangeText={setNumero} mode="outlined" />
          <HelperText type="info" visible={true} style={{textAlign: 'center'}}>
            Não sabe o código? <Button mode="text" compact onPress={showDialog} labelStyle={{fontSize: 12}}>Clique aqui</Button>
          </HelperText>
        </>
      )}

      <Checkbox.Item
        label="Eu li e aceito os Termos e Condições"
        status={agreeToTerms ? 'checked' : 'unchecked'}
        onPress={() => setAgreeToTerms(!agreeToTerms)}
        labelStyle={{fontSize: 14, color: theme.colors.placeholder}}
        style={styles.checkbox}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.mainButton} labelStyle={styles.mainButtonText} icon="account-plus-outline" loading={isLoading} disabled={isLoading || !agreeToTerms}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
      <Button mode="text" onPress={() => setFormType('login')} style={styles.switchButton}>
        Já tem uma conta? Faça login
      </Button>
    </>
  );

  return (
    <PaperProvider theme={theme}>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="information-outline" size={48} color={theme.colors.primary} />
          <Dialog.Title style={{textAlign: 'center'}}>Código de Acesso</Dialog.Title>
          <Dialog.Content>
            <Paragraph>O código de acesso do condomínio é um identificador único. Você pode encontrá-lo na sua fatura ou consultar a administração.</Paragraph>
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
                <Avatar.Image size={80} source={require('../assets/aqua-logo.png')} style={{backgroundColor: 'transparent'}} />
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
        style={{backgroundColor: theme.colors.error}}
      >
        {snackbarMessage}
      </Snackbar>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', backgroundColor: theme.colors.background },
  container: { padding: 20 },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingVertical: 8 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, marginTop: 8 },
  paragraph: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center', marginBottom: 20, },
  input: { marginBottom: 12 },
  mainButton: { marginTop: 16, paddingVertical: 8 },
  mainButtonText: { fontSize: 16, fontWeight: 'bold' },
  switchButton: { marginTop: 12 },
  segmentedButtons: { marginBottom: 20 },
  checkbox: { backgroundColor: theme.colors.surface, marginTop: 10, borderRadius: theme.roundness },
});