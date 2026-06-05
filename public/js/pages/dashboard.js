import api from "../api.js"

if (!localStorage.getItem("token")) {
    window.location.href = "/pages/login.html";
}

async function init() {
    try {
        const profile = await api("/users/profile")
        document.getElementById("userEmail").innerText = "Logado como: " + profile.email

        await carregarMinhasDisciplinas()
        await carregarDisciplinas()

    } catch (err) {
        console.error(err)
    }
}

async function carregarDisciplinas() {
    const tabela = document.getElementById("tabelaDisciplinas")

    try {
        const [disciplinas, matriculas] = await Promise.all([
            api("/disciplinas"),
            api("/matriculas")
        ])

        const matriculaIds = new Set(matriculas.map(m => m.disciplinaId))

        tabela.innerHTML = ""

        disciplinas.forEach(d => {
            const jaMatriculado = matriculaIds.has(d.id)
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${d.nome}</td>
                <td>${d.cargaHoraria}</td>
                <td>${d.semestre}</td>
                <td>
                    <button
                        class='btn-matricular'
                        data-id='${d.id}'
                        ${jaMatriculado ? "disabled" : ""}
                    >
                        ${jaMatriculado ? "Matriculado" : "Me matricular"}
                    </button>
                </td>
            `
            tabela.appendChild(tr)
        })

        document.querySelectorAll(".btn-matricular").forEach(btn => {
            btn.addEventListener("click", () => matricular(btn.dataset.id, btn))
        })

    } catch (err) {
        console.error(err)
        tabela.innerHTML = `<tr><td colspan="4">Erro ao carregar disciplinas</td></tr>`
    }
}

async function carregarMinhasDisciplinas() {
    const tabela = document.getElementById("tabelaMatriculas")

    try {
        const matriculas = await api("/matriculas")

        tabela.innerHTML = ""

        if (matriculas.length === 0) {
            tabela.innerHTML = '<tr><td colspan="7">Nenhuma matrícula ainda</td></tr>'
            return
        }

        matriculas.forEach(m => {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${m.disciplina.nome}</td>
                <td>${m.disciplina.cargaHoraria}</td>
                <td>${m.disciplina.semestre}</td>
                <td>${m.status}</td>
                <td>${m.faltas}</td>
                <td>${m.nota ?? "-"}</td>
                <td>
                    <button
                        class="btn-desmatricular"
                        data-matricula-id="${m.disciplinaId}"
                        data-nome="${m.disciplina.nome}"
                    >
                        <i class="fa-solid fa-right-from-bracket"></i> Sair
                    </button>
                </td>
            `
            tabela.appendChild(tr)
        })

        document.querySelectorAll(".btn-desmatricular").forEach(btn => {
            btn.addEventListener("click", () => desmatricular(btn.dataset.matriculaId, btn.dataset.nome))
        })

    } catch (err) {
        console.error(err)
        tabela.innerHTML = '<tr><td colspan="7">Erro ao carregar matrículas</td></tr>'
    }
}

async function matricular(disciplinaId, btn) {
    try {
        btn.disabled = true
        btn.innerText = "Matriculando..."

        await api("/matriculas", {
            method: "POST",
            body: JSON.stringify({ disciplinaId: Number(disciplinaId) })
        })

        btn.innerHTML = "Matriculado"
        await carregarMinhasDisciplinas()
        await carregarDisciplinas()

    } catch (err) {
        btn.disabled = false
        btn.innerText = "Me matricular"
        alert(err.error || "Erro ao matricular")
    }
}

async function desmatricular(matriculaId, nomeDisciplina) {
    const confirmado = confirm(`Deseja sair de "${nomeDisciplina}"?\nEssa ação não pode ser desfeita.`)
    if (!confirmado) return

    try {
        await api(`/matriculas/${matriculaId}`, { method: "DELETE" })

        await carregarMinhasDisciplinas()
        await carregarDisciplinas()

    } catch (err) {
        alert(err.error || "Erro ao cancelar matrícula")
    }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/pages/login.html"
})

document.getElementById("configBtn").addEventListener("click", () => {
    window.location.href = "/pages/config.html"
})

init()