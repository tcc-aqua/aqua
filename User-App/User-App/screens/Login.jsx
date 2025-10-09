"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather } from "@expo/vector-icons";

// --- Variantes de Animação ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// --- Componentes Reutilizáveis ---

// Fundo animado com efeito de aurora
const AnimatedBackground = () => (
  <>
    <motion.div
      style={styles.backgroundBubble1}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
    />
    <motion.div
      style={styles.backgroundBubble2}
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
    />
  </>
);

// Campo de entrada com ícone
const InputField = ({ iconName, type, placeholder, value, onChange }) => (
  <div style={styles.inputContainer}>
    <Feather name={iconName} size={20} color="#888" style={styles.inputIcon} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={styles.input}
    />
  </div>
);

// Botão de submissão com estado de carregamento
const SubmitButton = ({ isLoading }) => (
  <motion.button
    type="submit"
    disabled={isLoading}
    style={styles.submitButton}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    {isLoading ? (
      <div style={styles.spinner} />
    ) : (
      "Entrar"
    )}
  </motion.button>
);

// Mensagem de erro animada
const ErrorMessage = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        style={styles.errorContainer}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Feather name="alert-circle" size={18} color="#ff5555" />
        <span style={{ marginLeft: 8 }}>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);


// --- Componente Principal da Página de Login ---

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulação de erro de login
      if (email !== "contato@exemplo.com" || password !== "123456") {
          setError("Email ou senha inválidos.");
      }
    }, 2000);
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // Animação de "tremor" para o formulário em caso de erro
  const shakeAnimation = error ? { x: [-5, 5, -5, 5, 0] } : {};
  const shakeTransition = { duration: 0.4 };

  return (
    <main style={styles.mainContainer}>
      <AnimatedBackground />

      <motion.div
        style={styles.loginCard}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div style={{ textAlign: "center" }} variants={itemVariants}>
          <h1 style={styles.title}>Olá!</h1>
          <p style={styles.subtitle}>Bem-vindo de volta.</p>
        </motion.div>

        <motion.form
          onSubmit={handleLogin}
          style={styles.form}
          variants={itemVariants}
          animate={shakeAnimation}
          transition={shakeTransition}
        >
          <InputField
            iconName="mail"
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
            <input
              type={secureTextEntry ? "password" : "text"}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputWithButton}
            />
            <button
              type="button"
              onClick={toggleSecureEntry}
              style={styles.toggleButton}
            >
              <Feather name={secureTextEntry ? "eye-off" : "eye"} size={20} color="#888" />
            </button>
          </div>

          <ErrorMessage message={error} />
          
          <SubmitButton isLoading={isLoading} />
        </motion.form>
      </motion.div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}


// --- Folha de Estilos CSS-in-JS ---

const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  backgroundBubble1: {
    position: 'absolute',
    top: '-15%',
    left: '-20%',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, rgba(0,120,255,0.2) 0%, rgba(0,150,255,0) 70%)',
    filter: 'blur(80px)',
  },
  backgroundBubble2: {
    position: 'absolute',
    bottom: '-15%',
    right: '-20%',
    width: 350,
    height: 350,
    background: 'radial-gradient(circle, rgba(0,150,255,0.2) 0%, rgba(0,120,255,0) 70%)',
    filter: 'blur(90px)',
  },
  loginCard: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    background: "rgba(20, 20, 20, 0.5)",
    backdropFilter: "blur(20px)",
    borderRadius: 32,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 0 80px rgba(0,150,255,0.2)",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0ff",
    margin: 0,
  },
  subtitle: {
    color: "#aaa",
    marginTop: 8,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 45px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
    color: "#fff",
    fontSize: 16,
    outline: "none",
  },
  inputWithButton: {
    width: "100%",
    padding: "12px 45px 12px 45px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
    color: "#fff",
    fontSize: 16,
    outline: "none",
  },
  toggleButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "rgba(255,0,0,0.1)",
    color: "#ff5555",
    borderRadius: 8,
    fontSize: 14,
    border: "1px solid rgba(255,0,0,0.2)",
  },
  submitButton: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    fontWeight: "bold",
    color: "#000",
    background: "#0ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    transition: "background-color 0.3s",
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid #000",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};