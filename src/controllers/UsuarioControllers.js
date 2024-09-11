import conn from "../config/conn.js"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import createUserToken from "../helpers/createUserToken.js"
import jwt from "jsonwebtoken"

export const register = async (request, response) => {
    const { nome, email, telefone, senha, confirmsenha } = request.body

    if (!nome) {
        response.status(400).json({ message: "nome é obrigatório" })
        return
    }
    if (!email) {
        response.status(400).json({ message: "email é obrigatório" })
        return
    }
    if (!telefone) {
        response.status(400).json({ message: "telefone é obrigatório" })
        return
    }
    if (!senha) {
        response.status(400).json({ message: "senha é obrigatório" })
        return
    }
    if (!confirmsenha) {
        response.status(400).json({ message: "confirma é obrigatório" })
        return
    }
    //----------------------------------------------
    if (!email.includes("@")) {
        response.status(409).json({ message: "@ é obrigatório" })
        return
    }

    if (senha != confirmsenha) {
        response.status(409).json({ message: "ser igual é obrigatório" })
        return
    }

    const checkSql = /*sql*/`SELECT * FROM usuarios WHERE ?? = ?`
    const checkSqlData = ["email", email]
    conn.query(checkSql, checkSqlData, async (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "Erro ao buscar email para cadastro" })
            return
        }

        //2º
        if (data.length > 0) {
            response.status(409).json({ err: "O email já está em uso" })
            return
        }

        //Posso fazer o registro
        const salt = await bcrypt.genSalt(12)
        // console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log("senha digitada:", senha);
        // console.log("senah com hash", senhaHash);

        //Criar o usuário
        const id = uuidv4
        const usuario_img = "userDefault.png"
        const insertSql = /*sql*/`INSERT INTO usuarios
        (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)
    `
        const insertSqlData = ["usuario_id", "nome", "email", "telefone", "senha", "imagem", id, nome, email, telefone, senhaHash, usuario_img]

        conn.query(insertSql, insertSqlData, (err) => {
            if (err) {
                console.error(err)
                response.status(500).json({ err: "Erro ao cadastrar usuário" })
                return
            }
            //criar um token
            const usuarioSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
            const usuarioData = ["usuario_id", id]
            conn.query(usuarioSql, usuarioData, async (err, data) => {
                if (err) {
                    console.error(err)
                    response.status(500).json({ err: "erro ao fazer login" })
                    return
                }
                const usuario = data[0]

                try {
                    await createUserToken(usuario, request, response)
                } catch (error) {
                    console.error(error)
                    response.status(500).json({ err: "Erro ao processar requisição" })
                }
            })

            response.status(201).json({ message: "Usuário cadastrado" })
        })
    })

}

export const login = (request, response) => {
    const { email, senha } = request.body

    if (!email) {
        response.status(400).json({ message: "email é obrigatório" })
        return
    }
    if (!senha) {
        response.status(400).json({ message: "senha é obrigatório" })
        return
    }

    const checkEmailSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkEmailData = ["email", email]
    conn.query(checkEmailSql, checkEmailData, async (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ err: "Erro ao fazer login" })
            return
        }

        if (data.length === 0) {
            response.status(500).json({ err: "Email não está cadastrado" })
            return
        }

        const usuario = data[0]
        console.log(usuario.senha)

        //comparar senhas
        const comparaSenha = await bcrypt.compare(senha, usuario.senha)
        console.log("Compara Senha: ", comparaSenha);
        if (!comparaSenha) {
            response.status(401).json({ message: "Senha inválido" })
        }

        try {
            await createUserToken
        } catch (error) {
            console.error(error)
            response.status(500).json({ err: "Erro ao processar a informação" })
        }
    })
    response.status(200).json({ message: "Rota de login" })

}

//checkUser -> verificar os usuário logado na aplicação
export const checkUser = async (request, response) => {
    let usuarioAtual

    if (request.headers.authorization) {
        //extrair o token -> barear token
        const token = getToken(request)
        console.log(token)

        const decoded = jwt.decode(token, "SENHASUPERSEGURA")
        console.log(decoded)
    } else {
        usuarioAtual = null
        response.status(200).json(usuarioAtual)
    }
}

//getUserById -> Verificar usuário
export const getUserById = async (request, response) => {
    const id = request.params.id

    const checkSql = /*sql*/ `SELECT usuario_id, nome, email, telefone, imagem FROM usuarios WHERE ?? = ?`
    const checkSqlData = ["usuario_id", id]
    conn.query(checkSql, checkSqlData, (err, data) => {
        if (err) {
            console.error(err)
            response.status(500).json({ message: "Erro ao buscar usuário" })
            return
        }

        if (data.length === 0) {
            response.status(404).json({ message: "Usuário não encontrado" })
            return
        }

        const usuario = data[0]
        response.status(200).json(usuario)
    })

}

//editUser -> controlador protegido, contém imagem de usuário
export const editUser = async (request, response) => {
    const { id } = request.params

    try {
        const token = getToken(request)
        // console.log(token)
        const user = await getUserByToken(token)
        // console.log(user);

        const { nome, email, telefone } = request.body
        let imagem = user.imagem
        if (request.file) {
            imagem = request.file.filename
        }

        if (!nome) {
            return response.status(400).json({ message: " o nome é obrigatorio" })
        }
        if (!email) {
            return response.status(400).json({ message: " o email é obrigatorio" })
        }
        if (!tellefone) {
            return response.status(400).json({ message: " o telefone é obrigatorio" })
        }
        //1ª verificar se usuario existe
        const checkSql =/*sql*/`SELECT * FROM usuario WHERE ?? = ?`
        const checkSqlData = ["usuario_id", id]
        conn.query(checkSql, checkData, (err, data) => {
            if (err) {
                return response.status(500).json("Erro ao verificar usuario para update")
            }
            if (data.length === 0) {
                return response.status(404).json("usuario não encontrada")
            }
            //2ª evitar usuario com email repetido
            const checkEmailSql = /*sql*/`SELECT * FROM usuario WHERE ?? = ? AND ?? !=?`
            const checkEmailData = ["email", email, "usuario_id", id]
            conn.query(checkEmailSql, checkEmailData, (err, data) => {
                if (err) {
                    return response.status(500).json("erro ao verificar email para update")
                }
                if (data.length > 0) {
                    return response.status(409).json("E-mail já está em uso")
                }
                //3ª atualizar o usuario
                const updateSql = /*sql*/`UPDATE usuarios SET ? WHERE ?? = ?`
                const updateData = [{ nome, email, telefone, imagem }, "usuario_id", id]
                conn.query(updateSql, updateData, (err) => {
                    if (err) {
                        return response.status(500).json({ message: "Erro ao atualizar usuario" })
                    }
                    response.status(200).json({ message: "usuario atualizado" })
                })
            })
        })


        //3ª atualizar o usuario
        //Verificações
        console.log(nome, email, telefone);
    } catch (error) {
        console.error(error)
    }
}