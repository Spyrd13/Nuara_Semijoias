# Nüara Semijoias — Frontend (React + Vite)

## Como rodar no VS Code

1. Extraia este zip numa pasta e abra a pasta no VS Code.
2. Abra o terminal integrado (`Ctrl + '` ou menu Terminal > New Terminal).
3. Instale as dependências (só precisa fazer isso uma vez):
   ```
   npm install
   ```
4. Rode o servidor de desenvolvimento:
   ```
   npm run dev
   ```
5. O terminal vai mostrar um link, algo como `http://localhost:5173`.
   Abra no navegador — a página atualiza sozinha sempre que você
   salvar um arquivo.

Pré-requisito: ter o **Node.js** instalado (versão 18 ou mais recente).
Para checar, rode `node -v` no terminal.

## Estrutura do projeto

```
index.html              → único HTML "de verdade", o React injeta tudo dentro dele
src/
  main.jsx              → ponto de entrada, ativa o roteador (BrowserRouter)
  App.jsx               → define as rotas (qual página aparece em cada URL)
  styles.css            → todo o visual (cores, fontes, layout)
  data/
    products.js         → lista de produtos fictícios (futuramente virá da sua API)
  pages/
    Home.jsx             → rota "/" — só os destaques (hero, 4 produtos, história, etc.)
    CollectionPage.jsx    → rota "/colecao" — catálogo completo
  components/
    Header.jsx           → topo com logo e menu (aparece em toda página)
    Hero.jsx              → banner de destaque
    ProductCard.jsx       → card de UM produto (reutilizado várias vezes)
    Collection.jsx        → grade de produtos, reutilizada na Home (com limite) e na
                             página de coleção (sem limite) — veja as props "limit" e "showSeeAll"
    Story.jsx             → seção "nossa história"
    Trust.jsx             → faixa "compra segura / rastreamento / feita à mão"
    Newsletter.jsx        → formulário de e-mail (exemplo de estado/useState)
    Footer.jsx            → rodapé (aparece em toda página)
```

## Páginas e rotas (react-router-dom)

O site agora tem duas páginas de verdade:
- `/` → Home, com só os destaques
- `/colecao` → catálogo completo de produtos

Cada rota é declarada em `App.jsx` dentro de `<Routes>`. Header e
Footer ficam FORA das rotas (no próprio App.jsx) porque aparecem em
qualquer página.

## Próximos passos sugeridos

- Trocar os `.placeholder` (os quadradinhos com ✦) por fotos reais
  dos produtos.
- Trocar `src/data/products.js` por uma chamada à API do backend
  quando ele estiver pronto (`fetch` ou `axios`).
- Criar a rota `/produto/:id` (página de um produto específico) e
  `/minha-conta` (login/histórico/rastreamento do cliente).
