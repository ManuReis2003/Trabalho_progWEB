
// Inicializar batidas no localStorage, se não existir
let batidas = JSON.parse(localStorage.getItem('batidas')) || []; // essa linha diz que a variável batidas será um array preenchido pelos dados trazidos do navegador (localStorage), o JSON.parse serve para converter tipos de dados, batidas(array) -> localStorage(String) e vice versa 

// Função para salvar batidas no localStorage
function salvarBatidas() {
    localStorage.setItem('batidas', JSON.stringify(batidas));
} // essa função tarnfora o array batidas em uma string JSON e armazena no localStorage 

// Função para registrar nova batida (essa função seria chamada da tela de relógio)
function registrarBatida(data, tipoBatida, justificativa) {
    // Verificar se já existe batida nesse dia
    const batidaExistente = batidas.find(b => b.data === data);

    const novaBatida = {
        data: data,
        tipo: tipoBatida,
        justificativa: justificativa || "Sem justificativa",
        hora: new Date().toLocaleTimeString() // Armazena a hora atual
    };

    if (batidaExistente) {
        batidaExistente.registros.push(novaBatida);
    } else {
        // Adicionar nova batida
        batidas.push({
            data: data,
            registros: [novaBatida]
        });
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
    if (filtroInicio && filtroFim) {  
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
                <td>
                    ${batidaDoDia ? batidaDoDia.registros.map(registro => `
                        <p>Tipo: ${registro.tipo}, Hora: ${registro.hora}, Justificativa: ${registro.justificativa}</p>
                    `).join('') : 'Sem batida'}
                </td>
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
    // Exibe a modal com os campos de escolha de tipo e justificativa
    document.getElementById('modal-batida').style.display = 'block';
    document.getElementById('data-modal').value = data; // Preenche o campo data com o dia selecionado
}

// Função para fechar a modal
function fecharModal() {
    document.getElementById('modal-batida').style.display = 'none';
}

// Função para salvar a batida através da modal
function salvarBatidaModal() {
    const data = document.getElementById('data-modal').value;
    const tipoBatida = document.getElementById('tipo-batida-modal').value;
    const justificativa = document.getElementById('justificativa-modal').value;

    if (!data) {
        alert("Por favor, selecione uma data.");
        return;
    }

    registrarBatida(data, tipoBatida, justificativa);
    fecharModal(); // Fecha a modal após salvar
    renderizarBatidas();  // Recarrega a tabela
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

