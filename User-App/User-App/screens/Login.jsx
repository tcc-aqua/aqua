import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
  Divider,
  Checkbox,
  Snackbar
} from 'react-native-paper';

// --- TEMA PERSONALIZADO (Aprimorado) ---
const theme = {
  ...DefaultTheme,
  roundness: 12, // Bordas mais arredondadas para todos os componentes
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
    accent: '#0056b3',
    background: '#F0F8FF', // Azul "Alice Blue" como fundo
    surface: '#FFFFFF',
    text: '#333333',
    placeholder: '#888888',
    error: '#B00020',
  },
};

// --- COMPONENTE PRINCIPAL ---
export default function LoginRegisterScreen({ onLogin: onSuccessfulLogin }) {
  // --- STATES ---
  const [formType, setFormType] = useState('login');
  const [registrationType, setRegistrationType] = useState('casa');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // --- FUNÇÕES ---
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogin = () => {
    setIsLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      showSnackbar('Login realizado com sucesso! Redirecionando...');
      // Atraso para o usuário ver a snackbar antes de chamar a função de login real
      setTimeout(() => {
        onSuccessfulLogin();
      }, 1500);
    }, 2000);
  };

  const handleRegister = () => {
    setIsLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      showSnackbar('Cadastro realizado com sucesso!');
      setFormType('login'); // Volta para a tela de login
    }, 2000);
  };

  // --- RENDERIZAÇÃO DOS FORMULÁRIOS ---
  const renderLoginForm = () => (
    <>
      <Paragraph style={styles.paragraph}>Bem-vindo! Faça login para continuar.</Paragraph>
      <TextInput label="Usuário" style={styles.input} mode="outlined" left={<TextInput.Icon icon="account-circle-outline" />} />
      <TextInput
        label="Senha"
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
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Paragraph style={styles.dividerText}>Ou entre com</Paragraph>
        <Divider style={styles.divider} />
      </View>
      <View style={styles.socialLoginContainer}>
        <Button icon="google" mode="outlined" onPress={() => {}} style={styles.socialButton}>Google</Button>
        <Button icon="facebook" mode="outlined" onPress={() => {}} style={styles.socialButton}>Facebook</Button>
      </View>
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
      
      {/* Campos de cadastro */}
      <TextInput label="CPF" style={styles.input} mode="outlined" keyboardType="numeric" />
      <TextInput label="Número de Telefone" style={styles.input} mode="outlined" keyboardType="phone-pad" />
      {registrationType === 'casa' && (
        <>
          <TextInput label="CEP" style={styles.input} mode="outlined" keyboardType="numeric" />
          <TextInput label="Cidade/Estado" style={styles.input} mode="outlined" />
        </>
      )}
      {registrationType === 'condominio' && (
        <>
          <TextInput label="Número do Condomínio" style={styles.input} mode="outlined" />
          <HelperText type="info" visible={true} style={{textAlign: 'center'}}>
            Não sabe o número? <Button mode="text" compact onPress={showDialog} labelStyle={{fontSize: 12, margin:0, padding:0}}>Clique aqui</Button>
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

  return (
    <PaperProvider theme={theme}>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="information-outline" size={48} color={theme.colors.primary} />
          <Dialog.Title style={{textAlign: 'center'}}>Número do Condomínio</Dialog.Title>
          <Dialog.Content>
            <Paragraph>O número do condomínio é um identificador único. Você pode encontrá-lo na sua fatura ou consultar a administração.</Paragraph>
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
        duration={Snackbar.DURATION_SHORT}
        style={{backgroundColor: theme.colors.primary}}
      >
        {snackbarMessage}
      </Snackbar>
    </PaperProvider>
  );
}

// --- ESTILOS APRIMORADOS ---
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', backgroundColor: theme.colors.background },
  container: { padding: 20 },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingVertical: 8 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, marginTop: 8 },
  paragraph: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center', marginBottom: 20,},
  input: { marginBottom: 12 },
  mainButton: { marginTop: 16, paddingVertical: 8 },
  mainButtonText: { fontSize: 16, fontWeight: 'bold' },
  switchButton: { marginTop: 12 },
  segmentedButtons: { marginBottom: 20 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1 },
  dividerText: { marginHorizontal: 10, color: theme.colors.placeholder },
  socialLoginContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, },
  socialButton: { flex: 1, marginHorizontal: 5 },
  checkbox: { backgroundColor: theme.colors.surface, marginTop: 10, borderRadius: theme.roundness },
});