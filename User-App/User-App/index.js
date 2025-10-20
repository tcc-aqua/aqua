// Arquivo: index.js

import { registerRootComponent } from 'expo';

// CORREÇÃO:
// A linha abaixo agora aponta para o arquivo 'app.jsx' que está na MESMA pasta
// que o index.js. Este é o caminho correto.
import App from './app'; 

// O resto continua igual
registerRootComponent(App);