function obterDadosBanco() {
    const usuarios = alasql(`SELECT * FROM usuarios`);
    const clientes = alasql(`SELECT * FROM clientes`);
    const enderecos = alasql(`SELECT * FROM enderecos`);

    return { usuarios, clientes, enderecos };
}

function gerarJSONParaDownload(data) {
    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'banco_de_dados.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
