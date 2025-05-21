let idioma = "es";
let preguntas = [];
let index = 0;
let score = 0;
let respuestaSeleccionada = null;
let respuestasUsuario = [];

const textos = {
  es: {
    iniciar: "Iniciar",
    siguiente: "Siguiente",
    reiniciar: "Reiniciar Quiz",
    idioma: "Idioma:",
    titulo: "Quiz XML",
    resultado: "Resultado final",
    puntuacion: "Puntuación",
    fin: "Fin del test",
    alerta: "Por favor selecciona una opción antes de continuar."
  },
  en: {
    iniciar: "Start",
    siguiente: "Next",
    reiniciar: "Restart Quiz",
    idioma: "Language:",
    titulo: "XML Quiz",
    resultado: "Final result",
    puntuacion: "Score",
    fin: "End of quiz",
    alerta: "Please select an option before continuing."
  }
};

function traducirUI() {
  document.getElementById("btn-iniciar").innerText = textos[idioma].iniciar;
  document.getElementById("btn-siguiente").innerText = textos[idioma].siguiente;
  document.getElementById("reiniciar").innerText = textos[idioma].reiniciar;
  document.getElementById("etiqueta-idioma").innerText = textos[idioma].idioma;
  document.getElementById("titulo").innerText = textos[idioma].titulo;
}

function iniciarQuiz() {
  idioma = document.getElementById("idioma").value;
  traducirUI();
  document.getElementById("seleccion-idioma").style.display = "none";
  document.getElementById("btn-siguiente").style.display = "block";
  document.getElementById("reloj").style.display = "block";
  cargarXML();
  iniciarReloj();
}

function cargarXML() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const xmlDoc = this.responseXML;
      preguntas = xmlDoc.getElementsByTagName("question");
      index = 0;
      score = 0;
      respuestasUsuario = [];
      mostrarPregunta();
    }
  };
  xhttp.open("GET", `preguntas_${idioma}.xml`, true);
  xhttp.send();
}

function mostrarPregunta() {
  if (index >= preguntas.length) {
    detenerReloj();
    mostrarResumen();
    return;
  }

  respuestaSeleccionada = null;

  const pregunta = preguntas[index];
  const wording = pregunta.getElementsByTagName("wording")[0].textContent;
  const choices = pregunta.getElementsByTagName("choice");

  let html = `<p><strong>${wording}</strong></p>`;
  for (let i = 0; i < choices.length; i++) {
    html += `
      <label>
        <input type="radio" name="opcion" value="${i}" onclick="respuestaSeleccionada = ${i}">
        ${choices[i].textContent}
      </label>`;
  }

  document.getElementById("pregunta").innerHTML = html;
}

function siguientePregunta() {
  if (respuestaSeleccionada === null) {
    alert(textos[idioma].alerta);
    return;
  }

  const choices = preguntas[index].getElementsByTagName("choice");
  const esCorrecta = choices[respuestaSeleccionada].getAttribute("correct") === "yes";

  if (esCorrecta) score++;

  respuestasUsuario.push(respuestaSeleccionada);
  index++;
  mostrarPregunta();
}

function mostrarResumen() {
  document.getElementById("btn-siguiente").style.display = "none";
  document.getElementById("reiniciar").style.display = "block";

  let resumenHTML = `<h2>${textos[idioma].resultado}: ${score} / ${preguntas.length}</h2><div class="resumen">`;

  for (let i = 0; i < preguntas.length; i++) {
    const pregunta = preguntas[i];
    const wording = pregunta.getElementsByTagName("wording")[0].textContent;
    const choices = pregunta.getElementsByTagName("choice");
    const correctaIndex = Array.from(choices).findIndex(c => c.getAttribute("correct") === "yes");
    const usuarioIndex = respuestasUsuario[i];

    resumenHTML += `<p><strong>${i + 1}. ${wording}</strong></p>`;

    for (let j = 0; j < choices.length; j++) {
      let clase = "";
      if (j === usuarioIndex) {
        clase = (j === correctaIndex) ? "correcta" : "incorrecta";
      }
      resumenHTML += `<label class="${clase}">${choices[j].textContent}</label>`;
    }
  }

  resumenHTML += `</div>`;
  document.getElementById("pregunta").innerHTML = resumenHTML;
  document.getElementById("puntuacion").innerHTML = "";
}

function reiniciarQuiz() {
  document.getElementById("seleccion-idioma").style.display = "block";
  document.getElementById("pregunta").innerHTML = "";
  document.getElementById("puntuacion").innerHTML = "";
  document.getElementById("reiniciar").style.display = "none";
  document.getElementById("btn-siguiente").style.display = "none";
  document.getElementById("reloj").innerText = "00:00";
  document.getElementById("reloj").style.display = "none";
  segundos = 0;
}
