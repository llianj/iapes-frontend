import { loginUser } from "../services/auth.service.js"

const form = document.querySelector("#loginForm")
const output = document.querySelector("#output")
const errorMessage = document.querySelector("#errorMessage")

function log(data) {
    if (output) {
        output.innerText = JSON.stringify(data, null, 2)
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        errorMessage.classList.remove("show");
    }, 5000);
}

function hideError() {
    errorMessage.classList.remove("show");
}
 


form.addEventListener("submit", async (event) => {
    event.preventDefault()
    hideError()

    const email = document.querySelector("#loginEmail").value
    const password = document.querySelector("#loginPassword").value

    try {
        const data = await loginUser(email, password)

        //Validação
        if (data.error) {
            log({
                error: data.error
            })
            showError(data.error || "Usuário ou senha incorretos");
            return
        }

        //Salvar
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        //Redirect
        window.location.href = "/pages/dashboard.html"
    } catch (err) {
        
        showError(err.message || "Erro ao fazer login. Tente novamente!");
    }
})