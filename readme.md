# AV1-TP-II — Sistema de Recomendação de Equipes de Produção

Sistema back-end (Node.js + TypeScript) que recomenda uma **equipe de profissionais**
(diretor, diretor de fotografia, editor, roteirista, sonoplasta, efeitos visuais) para
um **projeto audiovisual**, a partir de diferentes estratégias de recomendação
(similaridade de competências, avaliações históricas ou otimização de orçamento).

O projeto foi construído como estudo de padrões de projeto (GoF): **Strategy**,
**Observer**, **Visitor**, **Template Method** e **Repository**.

---

## Sumário

- [Arquitetura](#arquitetura)
- [Padrões de projeto utilizados](#padrões-de-projeto-utilizados)
- [Modelo de dados](#modelo-de-dados)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Como rodar os testes](#como-rodar-os-testes)
- [API HTTP](#api-http)

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
  chaves são exatamente os papéis que o projeto precisa — é a partir dessas
  chaves que `RegrasOrcamento` decide quais papéis preencher.
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

```bash
npx jest
```

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
