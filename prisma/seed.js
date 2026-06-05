import { PrismaClient } from "@prisma/client"
import fs from "fs"
import { type } from "os"
import path from "path"

const prisma = new PrismaClient()


async function main() {
    
    
    const filePath = path.resolve("./data/disciplinas.json")
    
    const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    )

    for (const d of data) {
        if(
            typeof d.nome !== "string" ||
            typeof d.cargaHoraria !== "number" ||
            typeof d.semestre !== "number"

        ) {
            throw new Error("Disciplina inválida")
        }
    }

    await Promise.all(
        data.map(disciplina =>
            prisma.disciplina.upsert({
                where: { nome: disciplina.nome},
                update: {},
                create: disciplina
            })
        )
    )

    console.log("Disciplinas importadas com sucesso")
}

main()
    .catch( e => console.error(e))
    .finally(() => prisma.$disconnect())
