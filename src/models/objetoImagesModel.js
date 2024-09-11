import conn from "../config/conn.js";

const tableObjetoImages = /*sql*/`
CREATE TABLE IF NOT EXISTS objetos_images(
    images_id VARCHAR(60) PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    objetos_id VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Objeto_id) REFERENCES objetos(objetos_id)
)
`;
conn.query(tableObjetoImages, (err) => {
    if (err) {
        console.error(err)
        return
    }
    console.log("Tabela [ObjetoImage] criada com sucesso!")
});
