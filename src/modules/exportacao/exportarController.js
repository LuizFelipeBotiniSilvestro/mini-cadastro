
document.getElementById('btnExportar').addEventListener('click', function () {
    const data = obterDadosBanco();
    gerarJSONParaDownload(data);
    alert('Banco de dados exportado com sucesso!');
});
