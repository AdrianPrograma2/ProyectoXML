let segundos = 0;
let intervalo;

function iniciarReloj() {
  intervalo = setInterval(() => {
    segundos++;
    let minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
    let seg = (segundos % 60).toString().padStart(2, '0');
    document.getElementById("reloj").innerText = `${minutos}:${seg}`;
  }, 1000);
}

function detenerReloj() {
  clearInterval(intervalo);
}
