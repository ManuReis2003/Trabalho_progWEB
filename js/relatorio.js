
let batidas = JSON.parse(localStorage.getItem('batidas')) || [];

// Função para salvar batidas no localStorage
function salvarBatidas() {
    localStorage.setItem('batidas', JSON.stringify(batidas));
}

// Função para registrar nova batida
function registrarBatida(data, tipoBatida, justificativa, hora, manual = false) {
    const batidaExistente = batidas.find(b => b.data === data);
    const novaBatida = {
        data: data,
        tipo: tipoBatida,
        justificativa: justificativa || "Sem justificativa",
        hora: hora,
        manual: manual // Marca a batida como adicionada manualmente
    };

    if (batidaExistente) {
        // Verifica se já existe uma batida do mesmo tipo no dia
        const batidaTipoExistente = batidaExistente.registros.some(registro => registro.tipo === tipoBatida);
        if (batidaTipoExistente) {
            alert(`Já existe uma batida do tipo "${formatarTipo(tipoBatida)}" registrada para este dia.`);
            return; // Retorna sem registrar a nova batida
        }

        // Se não existir, adiciona a nova batida
        batidaExistente.registros.push(novaBatida);
    } else {
        // Se não houver batidas, cria uma nova entrada
        batidas.push({
            data: data,
            registros: [novaBatida]
        });
    }

    salvarBatidas();
}

// Função para verificar se a data e hora selecionadas são no futuro
function validarDataHora(data, hora) {
    const dataHoraSelecionada = new Date(`${data}T${hora}`);
    return dataHoraSelecionada > new Date();
}

// Função para obter todos os dias do mês atual
function getDiasDoMes(ano, mes) {
    const dias = [];
    const diasNoMes = new Date(ano, mes , 0).getDate(); // Último dia do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
        dias.push({
            data: new Date(ano, mes - 1, dia).toISOString().split('T')[0] // Formata para YYYY-MM-DD
        });
    }
    return dias;
}

// Função para renderizar a tabela de batidas
function renderizarBatidas(filtroInicio = null, filtroFim = null) {
    const tbody = document.getElementById('batidas');
    tbody.innerHTML = '';

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth() + 1;

    let diasDoMes = getDiasDoMes(anoAtual, mesAtual);

    if (filtroInicio && filtroFim) {
        const dataInicio = new Date(filtroInicio);
        const dataFim = new Date(filtroFim);
        diasDoMes = diasDoMes.filter(dia => {
            const dataDia = new Date(dia.data);
            return dataDia >= dataInicio && dataDia <= dataFim; // Corrigido para incluir apenas o intervalo
        });
    }

    diasDoMes.forEach(dia => {
        const batidaDoDia = batidas.find(b => b.data === dia.data);
        tbody.innerHTML += `
            <tr>
                <td>${new Date(dia.data).toLocaleDateString('pt-BR')}</td>
                <td>
                    ${batidaDoDia ? batidaDoDia.registros.map((registro, index) => `
                        <p>
                            ${registro.manual ? '➕' : ''}${registro.hora} ${formatarTipo(registro.tipo)} 
                            ${registro.justificativa ? `- Justificativa: ${registro.justificativa}` : ''}
                            <button onclick="excluirBatida('${dia.data}', ${index})">Excluir</button>
                        </p>
                    `).join('') : 'Sem batida'}
                </td>
                <td>
                    <button onclick="abrirModal('${dia.data}')">Incluir/Editar</button>
                </td>
            </tr>
        `;
    });

    const tabelaRelatorio = document.getElementById('tabela-relatorio');
    tabelaRelatorio.style.overflowY = 'auto';
    tabelaRelatorio.style.maxHeight = '400px';
}

//função para excluir batida
function excluirBatida(data, index) {
    const batidaDoDia = batidas.find(b => b.data === data);
    if (batidaDoDia) {
        // Remove a batida do índice especificado
        batidaDoDia.registros.splice(index, 1);
        
        // Se não houver mais registros para essa data, remove a entrada
        if (batidaDoDia.registros.length === 0) {
            batidas = batidas.filter(b => b.data !== data);
        }

        salvarBatidas(); // Salva as alterações no localStorage
        renderizarBatidas(); // Atualiza a tabela de batidas
    }
}


// Função para abrir o modal
function abrirModal(data) {
    document.getElementById('modal-batida').style.display = 'block';
    // document.getElementById('data-modal').value = data; // Remover isso
    document.getElementById('hora-modal').value = '';
    selectedDate = data; // Defina uma variável global ou de escopo superior para armazenar a data selecionada
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modal-batida').style.display = 'none';
}

// Função para salvar a batida do modal
function salvarBatidaModal() {
    const data = selectedDate; // Use a data selecionada
    const hora = document.getElementById('hora-modal').value;
    const tipoBatida = document.getElementById('tipo-batida-modal').value;
    const justificativa = document.getElementById('justificativa-modal').value;

    if (!hora) {
        alert("Por favor, selecione uma hora.");
        return;
    }

    if (validarDataHora(data, hora)) {
        alert("Não é possível incluir uma batida futura");
        return;
    }

    registrarBatida(data, tipoBatida, justificativa, hora, true);
    fecharModal();
    renderizarBatidas();
}
// function salvarBatidaModal(data) { // Receber a data como parâmetro
//     const hora = document.getElementById('hora-modal').value;
//     const tipoBatida = document.getElementById('tipo-batida-modal').value;
//     const justificativa = document.getElementById('justificativa-modal').value;

//     if (!data || !hora) {
//         alert("Por favor, selecione uma data e uma hora.");
//         return;
//     }

//     if (validarDataHora(data, hora)) {
//         alert("Não é possível incluir uma batida futura");
//         return;
//     }

//     registrarBatida(data, tipoBatida, justificativa, hora, true);
//     fecharModal();
//     renderizarBatidas();
// }

// Função para aplicar o filtro
function aplicarFiltro() {
    const inicio = document.getElementById('data-inicio').value;
    const fim = document.getElementById('data-fim').value;

    if (inicio && fim) {
        renderizarBatidas(inicio, fim);
    } else {
        alert('Selecione um período válido.');
    }
}

// Função para formatar o tipo de batida
function formatarTipo(tipo) {
    switch (tipo) {
        case 'entrada': return 'Entrada';
        case 'intervalo': return 'Intervalo';
        case 'volta-intervalo': return 'Volta intervalo';
        case 'saida': return 'Saída';
        default: return '';
    }
}

// Função para inicializar a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    renderizarBatidas();
});
