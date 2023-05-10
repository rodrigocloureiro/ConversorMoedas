const valor = document.querySelector('#valor');
let moedaAtual = document.querySelector('#moeda_atual');
let moedaCotada = document.querySelector('#moeda_cotada');
const btnCotar = document.querySelector('#cotar');
const resultado = document.querySelector('#resultado');
const erro = document.querySelector('#erro');
const horario = document.querySelector('#horario');
const btnInveter = document.querySelector('.swap svg').addEventListener('click', inverter);

btnCotar.disabled = true;
btnCotar.addEventListener('click', exibirCotacao);

fetch('./assets/data.json')
.then(response => response.json())
.then(data => {
  for(keys in data) {
    for(key in data.sort(() => Intl.Collator().compare())[keys]) {
      const optionAtual = document.createElement('option');
      optionAtual.value = key;
      optionAtual.textContent = `${key} - ${data[keys][key]}`;
      const optionCotada = document.createElement('option');
      optionCotada.value= key;
      optionCotada.textContent = `${key} - ${data[keys][key]}`;
      moedaAtual.appendChild(optionAtual);
      moedaCotada.appendChild(optionCotada);
    };
  }
});

valor.addEventListener('input', (e) => {
  if(e.target.value > 0) {
    e.target.classList.remove('error');
    erro.classList.remove('show_error');
    if(moedaAtual.value !== '-1' && moedaCotada.value !== '-1')
      btnCotar.disabled = false;
  }
  else {
    e.target.classList.add('error');
    erro.classList.add('show_error');
    btnCotar.disabled = true;
  }
});

function inverter() {
  if(moedaAtual.value !== '-1' && moedaCotada.value !== '-1') {
    const aux = moedaAtual.value;
    moedaAtual.value = moedaCotada.value;
    moedaCotada.value = aux;
    valor.value > 0 ? exibirCotacao() : null;
  }
}

async function getCotacao() {
  try {
    const response = await fetch(`https://economia.awesomeapi.com.br/json/${moedaAtual.value}-${moedaCotada.value}`);
    console.log(response);
    
    if (!response.ok) throw new Error(`Não é possível fazer a conversão de ${moedaAtual.value} para ${moedaCotada.value}`);
    
    const data = await response.json();
    console.log(data);
    return data;
    
  } catch(error) {
    console.log(error);
    resultado.textContent = error;
    return error.ok;
  }
}

async function exibirCotacao() {
  let cotacao = await getCotacao();
  if(cotacao) {
    resultado.textContent = `${(cotacao[0].ask * Number(valor.value)).toFixed(2)} ${moedaCotada.value}`;
    horario.textContent = `Cotação realizada em: ${(cotacao[0].create_date).toLocaleString()}`;
    // horario.textContent = `Cotação realizada em: ${(new Date).toLocaleString()}`;
  }
}
