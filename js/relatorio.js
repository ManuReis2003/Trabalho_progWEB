function criarRelatorio() {

    const containerRegistros = document.getElementById("container-registros");

    let registros = JSON.parse(localStorage.getItem("registro"));
    registros.forEach(registro => {
        console.log(registro);
        
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("abcd");
        
        // para carda registro, temos
        // hora: registro.hora (já está na variável hora)
        // data: registro.data
        // tipo: registro.tipo

        let hora = registro.hora;
        let data = registro.data;
        let tipo = registro.tipo;

        divRegistro.innerHTML = `<p> ${tipo} | ${data} | ${hora} </p>`
        const buttonEditar = document.createElement("button");


        // Adicionar botões
        containerRegistros.appendChild(divRegistro);
        divRegistro.appendChild(buttonEditar);
    });

    /* 
    2. iterar sobre os registros
    2.1 para cada registro, criar um elemento na página
    2.2 Tipo | hora | obs? | anexo? | editar | excluir
    2.3 agrupar registros por data

    */
}
// REQUISITO 1 - MANU 
function criarRelatorio() {
    const containerRegistros = document.getElementById("container-registros");
    let registros = JSON.parse(localStorage.getItem("registro"));
    const today = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD

    registros.forEach(registro => {
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("registro");

        // Verifica se a data do registro é anterior à data atual
        if (registro.data < today) {
            divRegistro.classList.add("data-passada"); // Adiciona uma classe específica
        }

        divRegistro.innerHTML = `<p>${registro.tipo} | ${registro.data} | ${registro.hora}</p>`;
        containerRegistros.appendChild(divRegistro);
    });
}