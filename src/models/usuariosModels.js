import conn from "../config/conn.js"

const tabelaUsuario = /*sql*/`CREATE TABLE IF NOT EXISTS usuarios(
    usuario_id VARCHAR(60) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    imagem VARCHAR(255)
    created_at TIMESTAMP DEFAULT VALUE CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT VALUE CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
)`
conn.query(tabelaUsuario, (err, results) => {
    if (err) {
        console.log(err)
        return
    }
    console.log("tabela [usuarios] criada com sucesso!")
})