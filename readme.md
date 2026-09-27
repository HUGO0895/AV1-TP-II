# AV1-TP-II — Sistema de Recomendação de Equipes de Produção

Sistema back-end (Node.js + TypeScript) que recomenda uma **equipe de profissionais**
(diretor, diretor de fotografia, editor, roteirista, sonoplasta, efeitos visuais) para
um **projeto audiovisual**, a partir de diferentes estratégias de recomendação
(similaridade de competências, avaliações históricas ou otimização de orçamento).

O projeto foi construído como estudo de padrões de projeto (GoF): **Strategy**,
**Observer**, **Visitor**, **Template Method** e **Repository**.

> 📄 Para detalhes sobre a suíte de testes automatizados criada para este repositório
> (o que é coberto, como rodar e bugs encontrados durante a escrita dos testes), veja
> [`docs/TESTES.md`](docs/TESTES.md).

---

## Sumário

- [Arquitetura](#arquitetura)
- [Padrões de projeto utilizados](#padrões-de-projeto-utilizados)
- [Modelo de dados](#modelo-de-dados)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Como rodar os testes](#como-rodar-os-testes)
- [API HTTP](#api-http)
- [Limitações e bugs conhecidos](#limitações-e-bugs-conhecidos)

---

## Arquitetura

O código fica todo em `src/` e é organizado por responsabilidade:

```
src/
├── app.ts                     # bootstrap da API (Fastify) + seed do banco
├── ConecBanco.ts               # configuração da conexão TypeORM (Postgres)
├── controller/
│   └── recomendacaoController.ts   # rota HTTP POST / e schema de validação
├── servico/
│   └── ServiceRecomendacao.ts      # converte Entidades (TypeORM) em Modelos de domínio
├── SistemaRecomendacao/
│   └── SistemaRecomendacao.ts      # fachada: orquestra + notifica observadores
├── Equipe/
│   ├── Modelo/                     # modelos de domínio (Profissional, Equipe, ...)
│   ├── Enum/papel.ts                # papéis possíveis (Papel)
│   └── Types/intervalo.ts
├── Projetos/
│   ├── Modelo/projetos.ts           # modelo de domínio Projeto
│   └── Enum/                        # TipoProjeto, Genero
├── Strategy/                   # as 3 estratégias de recomendação
├── Observer/                   # notificações após uma recomendação
├── Visitor/                    # operações sobre Projeto/Profissional (relatório, etc.)
├── Entidades/                  # entidades TypeORM (persistência)
├── Repositorio/                # repositórios TypeORM
└── migration/                  # migrações do schema Postgres
```

Há uma separação clara entre:

- **Entidades** (`src/Entidades`): classes anotadas com decorators do TypeORM,
  usadas só para persistência (ligadas ao Postgres).
- **Modelos de domínio** (`src/Equipe/Modelo`, `src/Projetos/Modelo`): classes puras
  em TypeScript, sem dependência de banco, usadas pela lógica de recomendação
  (Strategy/Observer/Visitor). É nelas que a suíte de testes automatizados foca,
  por serem testáveis sem precisar de um Postgres rodando.

`ServiceRecomendacao` é a camada que busca profissionais no banco (via
`ProfissionaisRepositorio`) e os converte de Entidade para Modelo de domínio antes de
repassar para o `SistemaRecomendacao`.

## Padrões de projeto utilizados

| Padrão | Onde | Papel |
|---|---|---|
| **Strategy** | `src/Strategy/*` (interface `RecomendacaoStrategy`) | Três formas de escolher a equipe: `SimiliaridadeCosseno`, `FiltragemColaborativa`, `RegrasOrcamento`. Trocadas em tempo de execução via `SistemaRecomendacao.definirEstrategiaAtual`. |
| **Observer** | `src/Observer/*` (interface `Observador`) | Após montar uma equipe, `SistemaRecomendacao` notifica `NotificadorEmail`, `NotificadorInterno` e `AuditoriaRecomendacao`. Novos observadores podem ser plugados com `adicionarObeservador`. |
| **Template Method** | `src/Equipe/Modelo/OrquestradorEquipe.ts` | Define o fluxo fixo `validar → normalizar → pós-processar` (`orquestrar`); `OrquestradorPadrao` implementa os passos variáveis. |
| **Visitor** | `src/Visitor/*` (interface `VisitanteProjeto`) | Operações sobre `Projeto`/`Profissional` sem alterar essas classes: `CalculadorCompatibilidade` (nota média), `GeradorRelatorio` (texto), `ValidadorConscistencia` (regras de negócio). |
| **Repository** | `src/Repositorio/*` | Encapsula acesso a cada entidade via TypeORM. |
| **Facade** | `SistemaRecomendacao` | Ponto único de entrada que esconde orquestrador + observadores do resto da aplicação. |

## Modelo de dados

Entidades principais (Postgres, via TypeORM — ver `src/migration`):

- **Profissional** — nome, disponibilidade (início/fim), preço médio; tem várias
  `CompetenciasProfissionais` e `Avaliacao`.
- **Competencias** — catálogo de competências (nome único).
- **CompetenciasProfissionais** — nível (1–5) de uma competência para um profissional.
- **Projetos** — gênero, tipo (`DOCUMENTARIO`/`FICÇÃO`/`ANIMAÇÃO`), duração, orçamento, prazo.
  Em memória, o campo `competencias` é um `Map<Papel, Array<Competencias>>` cujas
  **chaves são exatamente os papéis que o projeto precisa** — é a partir dessas
  chaves que `RegrasOrcamento` decide quais papéis preencher (ver seção de bugs
  conhecidos, item 3, para o histórico dessa decisão).
- **Avaliacao** — nota (1–5, via `CHECK`), comentário, papel avaliado, ligada a um
  profissional e ao projeto avaliador.
- **Recomendacao** / **RecomendacaoProfissionais** — histórico de recomendações feitas.

`Papel` (`src/Equipe/Enum/papel.ts`) define os seis papéis de equipe possíveis:
`DIRETOR`, `DIRETOR_FOTOGRAFIA`, `SONOPLASTA`, `EDITOR`, `ROTEITISTA`,
`EFEITOS_VISUAIS`. Nem todo projeto precisa de todos eles — os papéis efetivamente
exigidos por um projeto são os presentes em `projeto.competencias`.

## Como rodar o projeto

Pré-requisitos: Node.js 18+ e Docker (para o Postgres) — ou um Postgres já disponível.

```bash
# 1. instalar dependências
npm install

# 2. configurar variáveis de ambiente
cp .envExemplo .env
# preencha DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME

# 3. subir o banco (opcional, se não tiver um Postgres já rodando)
docker compose up -d

# 4. rodar as migrações
npm run typeorm migration:run

# 5. iniciar a API (faz o seed do banco na primeira vez que rodar)
npx ts-node src/app.ts
```

A API sobe em `http://localhost:3000`.

## Como rodar os testes

Este repositório não tinha nenhum framework de testes configurado
(`"test": "echo \"Error: no test specified\" && exit 1"`). Foi adicionado **Jest +
ts-jest**, com uma suíte de testes unitários para toda a lógica de domínio
(estratégias, observadores, visitantes, orquestrador e a fachada `SistemaRecomendacao`).

```bash
npm install       # instala jest/ts-jest, incluídos no devDependencies
npm test          # roda toda a suíte
npm run test:coverage   # roda com relatório de cobertura
```

Os testes **não** dependem de Postgres — eles trabalham só com os modelos de domínio
em memória. Veja [`docs/TESTES.md`](docs/TESTES.md) para a lista completa do que é
coberto e por quê.

> ⚠️ Arquivos auxiliares de teste (fábricas em `helpers/factories.ts`, mocks em
> `DadosMock/`) precisam ficar **fora** de qualquer pasta chamada `__tests__`, ou
> configurados em `testMatch` no `jest.config.js` (ex.: `"**/__tests__/**/*.test.ts"`).
> Caso contrário o Jest tenta executá-los como suíte de teste e falha com
> `"Your test suite must contain at least one test"`.

## API HTTP

### `POST /`

Recomenda uma equipe para um projeto. Corpo da requisição validado pelo schema em
`src/controller/recomendacaoController.ts`:

```json
{
  "id": 1,
  "genero": "DRAMA",
  "tipo": "FICÇÃO",
  "duracaoMin": 90,
  "orcamento": 150000,
  "prazo": "2026-06-01T00:00:00.000Z",
  "competencias": {
    "DIRETOR": [{ "nome": "Direção", "nivel": 5 }],
    "EDITOR": [{ "nome": "Edição", "nivel": 4 }]
  },
  "estrategia": "similiaridadecosseno"
}
```

`competencias` é indexado por `Papel` — apenas os papéis presentes aqui são
considerados pelas estratégias de recomendação (ver [Modelo de dados](#modelo-de-dados)).

`estrategia` aceita: `similiaridadecosseno` (padrão), `filtragemcolaborativa` ou
`regrasdeorcamento`.

Resposta (200):

```json
{ "Recomendacao": { "dataFormacao": "...", "status": "formada", "membrosEquipe": [...] } }
```

Erros de validação/execução retornam `400 { "status": "error" }`.

> ⚠️ Ver [Limitações e bugs conhecidos](#limitações-e-bugs-conhecidos) — o schema da
> rota usa a chave `comepetencias` (com erro de digitação) em vez de `competencias`,
> então o campo de competências ainda não é de fato validado pelo Fastify hoje.

## Limitações e bugs conhecidos

Encontrados durante a leitura do código e a escrita dos testes (documentados também
em `docs/TESTES.md`). Status atualizado conforme o que já foi corrigido:

1. **`RegrasOrcamento` não maximiza a pontuação de fato — 🔧 correção identificada, pendente de aplicar.**
   O modelo passado para `javascript-lp-solver` usa a chave `optmize` (faltando um
   "i") em vez de `optimize`. A biblioteca não reconhece a chave, então o solver
   apenas retorna *uma* solução viável (respeitando orçamento e "1 pessoa por
   papel"), não necessariamente a de maior nota. Correção: renomear `optmize` para
   `optimize` em `src/Strategy/RegrasOrcamento.ts`.

2. **`OrquestradorEquipe.validarRestricoes` (em `OrquestradorPadrao`) quase nunca
   barra nada — ⚠️ ainda em investigação.**
   A checagem `'competencias' in projeto` é sempre `true` para uma instância real
   de `Projeto`, porque o campo é atribuído no construtor mesmo quando `undefined`.
   O erro amigável `"O projeto não possui competencias"` só dispara se um objeto
   sem essa propriedade for passado; caso contrário, o erro real (`TypeError`
   ao tentar ler competências ausentes) só aparece dentro da estratégia escolhida.

3. **`Projeto.competencias` como `Map<Papel, Array<Competencias>>` — ✅ resolvido.**
   As estratégias (`RegrasOrcamento`, `SimiliaridadeCosseno`) sempre esperaram um
   `Map` de verdade (usam `.keys()`/`.get()`), o que já bate com a tipagem
   declarada em `Projeto.ts`. O problema estava nas fábricas de teste
   (`helpers/factories.ts`), que chegaram a montar `competencias` como objeto
   comum em vez de `Map`, causando `TypeError: ...keys is not a function` nos
   testes. A fábrica `novoProjeto` agora constrói `new Map(Object.entries(...))`
   corretamente. **As chaves do `Map` definem quais papéis o projeto exige** —
   `RegrasOrcamento` já respeita isso (`for (const papel of projeto.competencias.keys())`),
   preenchendo apenas os papéis pedidos, não todos os valores do enum `Papel`.

4. **Schema da rota `POST /` usa `comepetencias`** (erro de digitação) em vez de
   `competencias` em `recomendacaoController.ts` — ⚠️ ainda aberto. Esse campo do
   corpo da requisição não é validado pelo Fastify como deveria.

5. **`kdkdk.py`, na raiz do repositório, contém uma API key exposta em texto
   puro** (usada supostamente para `openrouteservice.org`) e não tem relação com o
   restante do projeto (Node/TypeScript) — ⚠️ ainda aberto. Recomenda-se remover o
   arquivo do histórico do repositório e revogar/rotacionar essa chave, já que
   ficou pública.

6. **`FiltragemColaborativa` e `SimiliaridadeCosseno` geram `NaN`/`Infinity`** se um
   profissional não tiver nenhuma avaliação para o papel avaliado (divisão por
   `length` igual a zero) — ⚠️ ainda aberto. Não há tratamento explícito para esse
   caso hoje.

A suíte de testes documenta o comportamento **atual** do código à medida que os
itens acima vão sendo corrigidos, servindo de rede de segurança para o que ainda
está pendente.