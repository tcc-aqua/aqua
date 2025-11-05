var wifi = require("Wifi");
var http = require("http");

var portaVazao = D25;
var pulsos = 0;
var consumoLitros = 0;
var ultimo_salvo = 0;

var ssid = "Aqua_sensor";
var password = "sensor1234";

var API_HOST = "192.168.100.112";
var API_PORT = 3333;
var API_PATH = "/api/leituras";

var SENSOR_ID = 1;

setWatch(function() {
  pulsos++;
}, portaVazao, { edge: 'falling', repeat: true });

function enviarLeitura(consumo, vazamento) {
  var data = JSON.stringify({
    sensor_id: SENSOR_ID,
    consumo: consumo.toFixed(2),
    vazamento_detectado: vazamento,
    data_registro: new Date().toISOString()
  });

  var options = {
    host: API_HOST,
    port: API_PORT,
    path: API_PATH,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  var req = http.request(options, function(res) {
    var resposta = "";
    res.on("data", function(d) { resposta += d; });
    res.on("close", function() {
      console.log("✅ Enviado:", resposta);
    });
  });

  req.on("error", function(e) {
    console.log("❌ Erro ao enviar:", e);
  });

  req.end(data);
}

function salvarLeitura() {
  var agora = Date.now();

  if (agora - ultimo_salvo > 1000) {
    ultimo_salvo = agora;

    var vazaoLPS = pulsos / 5.5;
    pulsos = 0;

    consumoLitros += vazaoLPS / 60;
    var vazamento = vazaoLPS > 0.3;

    console.log("Fluxo:", vazaoLPS.toFixed(3), "L/s | Total:", consumoLitros.toFixed(2), "L");

    enviarLeitura(consumoLitros, vazamento);
  }
}

function start() {
  pinMode(portaVazao, 'input_pullup');
  console.log("Conectando ao Wi-Fi...");

  wifi.connect(ssid, { password: password }, function(err) {
    if (err) {
      console.log("Erro ao conectar Wi-Fi:", err);
      return;
    }

    console.log("Wi-Fi conectado! IP:", wifi.getIP().ip);
    setInterval(salvarLeitura, 1000);
  });
}

start();
