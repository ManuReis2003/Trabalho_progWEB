// function criarRelatorio() {

//     const containerRegistros = document.getElementById("container-registros");

//     let registros = JSON.parse(localStorage.getItem("registro"));
//     registros.forEach(registro => {
//         console.log(registro);
        
//         const divRegistro = document.createElement("div");
//         divRegistro.classList.add("abcd");
        
//         // para carda registro, temos
//         // hora: registro.hora (já está na variável hora)
//         // data: registro.data
//         // tipo: registro.tipo

//         let hora = registro.hora;
//         let data = registro.data;
//         let tipo = registro.tipo;

//         divRegistro.innerHTML = `<p> ${tipo} | ${data} | ${hora} </p>`
//         const buttonEditar = document.createElement("button");


//         // Adicionar botões
//         containerRegistros.appendChild(divRegistro);
//         divRegistro.appendChild(buttonEditar);
//     });

//     /* 
//     2. iterar sobre os registros
//     2.1 para cada registro, criar um elemento na página
//     2.2 Tipo | hora | obs? | anexo? | editar | excluir
//     2.3 agrupar registros por data

//     */
// }
// // REQUISITO 1 - MANU 
// function criarRelatorio() {
//     const containerRegistros = document.getElementById("container-registros");
//     let registros = JSON.parse(localStorage.getItem("registro"));
//     const today = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD

//     registros.forEach(registro => {
//         const divRegistro = document.createElement("div");
//         divRegistro.classList.add("registro");

//         // Verifica se a data do registro é anterior à data atual
//         if (registro.data < today) {
//             divRegistro.classList.add("data-passada"); // Adiciona uma classe específica
//         }

//         divRegistro.innerHTML = `<p>${registro.tipo} | ${registro.data} | ${registro.hora}</p>`;
//         containerRegistros.appendChild(divRegistro);
//     });
// }

// Inicializar batidas no localStorage, se não existir
let batidas = JSON.parse(localStorage.getItem('batidas')) || [];

// Função para salvar batidas no localStorage
function salvarBatidas() {
    localStorage.setItem('batidas', JSON.stringify(batidas));
}

// Função para registrar nova batida (essa função seria chamada da tela de relógio)
function registrarBatida(data, entrada, saida) {
    // Verificar se já existe batida nesse dia
    const batidaExistente = batidas.find(b => b.data === data);

    if (batidaExistente) {
        batidaExistente.entrada = entrada || batidaExistente.entrada;
        batidaExistente.saida = saida || batidaExistente.saida;
    } else {
        // Adicionar nova batida
        batidas.push({ data, entrada, saida });
    }

    salvarBatidas();  // Atualiza o localStorage
}

// Função para obter todos os dias do mês
function getDiasDoMes(ano, mes) {
    let dias = [];
    let totalDias = new Date(ano, mes, 0).getDate(); // Total de dias no mês
    for (let dia = 1; dia <= totalDias; dia++) {
        let data = new Date(ano, mes - 1, dia);
        dias.push({
            data: data.toISOString().slice(0, 10), // Formato YYYY-MM-DD
            entrada: null,
            saida: null
        });
    }
    return dias;
}

// Função para renderizar a tabela de batidas, exibindo todos os dias do mês
function renderizarBatidas(filtroInicio = null, filtroFim = null) {
    const tbody = document.getElementById('batidas');
    tbody.innerHTML = ''; // Limpar tabela antes de renderizar

    // Obter mês e ano atuais
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth() + 1; // Janeiro é 0, então adiciona 1

    // Gerar todos os dias do mês
    let diasDoMes = getDiasDoMes(anoAtual, mesAtual);

    // Aplicar filtro, se houver
    if (filtroInicio && filtroFim) {  //verifica se as variaveis filtroInicio e filtroFim estao definidas e tem valores
        const dataInicio = new Date(filtroInicio);
        const dataFim = new Date(filtroFim);
        diasDoMes = diasDoMes.filter(dia => {
            const dataDia = new Date(dia.data);
            return dataDia >= dataInicio && dataDia <= dataFim;
        });
    }

    // Renderizar cada dia
    diasDoMes.forEach(dia => {
        const batidaDoDia = batidas.find(b => b.data === dia.data);

        tbody.innerHTML += `
            <tr>
                <td>${new Date(dia.data).toLocaleDateString('pt-BR')}</td>
                <td>${batidaDoDia ? batidaDoDia.entrada : 'Sem batida'}</td>
                <td>${batidaDoDia ? batidaDoDia.saida : 'Sem batida'}</td>
                <td>
                    <button onclick="abrirModal('${dia.data}')">Incluir/Editar</button>
                </td>
            </tr>
        `;
    });

    // Adicionar rolagem à tabela
    const tabelaRelatorio = document.getElementById('tabela-relatorio');
    tabelaRelatorio.style.overflowY = 'auto';
    tabelaRelatorio.style.maxHeight = '400px'; // Ajuste conforme a altura da página desejada
}

// Função para abrir modal de edição/inclusão de batida
function abrirModal(data) {
    const entrada = prompt("Informe o horário de entrada (HH:MM):");
    const saida = prompt("Informe o horário de saída (HH:MM):");
    registrarBatida(data, entrada, saida);
    renderizarBatidas();  // Recarregar tabela
}

// Função para aplicar o filtro de período
function aplicarFiltro() {
    const inicio = document.getElementById('data-inicio').value;
    const fim = document.getElementById('data-fim').value;

    if (inicio && fim) {
        renderizarBatidas(inicio, fim);
    } else {
        alert('Selecione um período válido.');
    }
}

// Inicializar tabela ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    renderizarBatidas();  // Renderiza a tabela quando a página carrega
});
