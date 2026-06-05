import matriculaService from "../services/matriculaService.js"

const matricular = async(req, res) => {
    try {
        const userId = req.userId
        const { disciplinaId } = req.body

        const matricula = await matriculaService.matricular(userId, Number(disciplinaId))

        return res.status(201).json(matricula)

    } catch (err) {

        if (err.code == "P2002")
            return res.status(409).json({
                error: "Você já está matriculado"
        })

        if (err.code == "P2003")
            return res.status(404).json({
                error: "Disciplina não encontrada"
        })

        return res.status(500).json({
            error: "Erro ao realizar matrícula"
        })

    }
}

const cancelarMatricula = async (req, res) => {
    try {
        const userId = req.userId
        const { disciplinaId } = req.params

        await matriculaService.cancelarMatricula(userId, Number(disciplinaId))

        return res.status(200).json({
            message: "Matricula cancelada com sucesso"
        })

    } catch (err) {
        if (err.code === "P2025")
            return res.status(404).json({
                error: "Matrícula nao encontrada"
            })
        return res.status(500).json({
            error: "Erro ao cancelar matrícula"
        })
    }
}

const getMinhasMatriculas = async (req, res) => {
    try {
        const userId = req.userId

        const matriculas = await matriculaService.getMinhasMatriculas(userId)

        return res.status(200).json(matriculas)

    } catch (err) {
        return res.status(500).json({
            error: "Erro ao buscar matriculas"
        })
    }
}

export default {
    matricular, 
    cancelarMatricula,
    getMinhasMatriculas
}