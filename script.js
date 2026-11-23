
const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");
const contador = document.querySelector("#contador");

let publicacoes = [];

function renderizarPublicacoes(lista) {
    painel.replaceChildren();

    contador.textContent = lista.length + " publicações";

    lista.forEach((publicacao) => {
        const cartao = document.createElement("article");
        cartao.classList.add("cartao");

        const id = document.createElement("span");
        id.textContent = "PUBLICAÇÃO #" + publicacao.id;

        const titulo = document.createElement("h2");
        titulo.textContent = publicacao.title;

        const texto = document.createElement("p");
        texto.textContent = publicacao.body;

        cartao.append(id, titulo, texto);
        painel.append(cartao);
    });

    if (lista.length === 0) {
        mensagem.textContent = "Nenhuma publicação encontrada.";
    } else {
        mensagem.textContent = "";
    }
}

function carregarPublicacoes() {
    mensagem.textContent = "Carregando publicações...";
    mensagem.classList.remove("erro");
    botao.disabled = true;

    fetch(URL)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro HTTP: " + resposta.status);
            }

            return resposta.json();
        })
        .then((dados) => {
            publicacoes = dados;
            renderizarPublicacoes(publicacoes);
        })
        .catch((erro) => {
            console.error(erro);

            publicacoes = [];
            painel.replaceChildren();
            contador.textContent = "0 publicações";

            mensagem.textContent =
                "Não foi possível carregar as publicações.";

            mensagem.classList.add("erro");
        })
        .finally(() => {
            botao.disabled = false;
        });
}

botao.addEventListener("click", carregarPublicacoes);

filtro.addEventListener("input", () => {
    const termo = filtro.value.trim().toLowerCase();

    const encontradas = publicacoes.filter((item) => {
        return item.title.toLowerCase().includes(termo);
    });

    renderizarPublicacoes(encontradas);
});
