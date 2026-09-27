# Guia de testes automatizados

Este repositório não possuía testes nem framework de testes configurado. Foi
adicionado **Jest** + **ts-jest** e uma suíte de **25 testes unitários** cobrindo
toda a lógica de domínio pura do sistema (Strategy, Observer, Visitor, o
orquestrador de equipe e a fachada `SistemaRecomendacao`).

## Como rodar

```bash
npm install
npm test                 # roda a suíte inteira
npm run test:watch       # modo watch, útil durante desenvolvimento
npm run test:coverage    # gera relatório de cobertura
```

Configuração em `jest.config.js` (gerada com `ts-jest`) e em `package.json`
(`scripts.test`).

## Estrutura

```
tests/
├── helpers/factories.ts              # construtores de dados de teste (Profissional, Projeto, ...)
├── strategy/
│   ├── SimiliaridadeCosseno.test.ts
│   ├── FiltragemColaborativa.test.ts
│   └── RegrasOrcamento.test.ts
├── observer/Observadores.test.ts
├── visitor/Visitors.test.ts
├── equipe/OrquestradorPadrao.test.ts
└── sistemaRecomendacao/SistemaRecomendacao.test.ts
```

`tests/helpers/factories.ts` concentra a criação de `Profissional`, `Projeto`,
`Competencias` e `Avaliacao` de domínio, para os testes não repetirem construtores
extensos. **Leia os comentários desse arquivo** — eles explicam uma decisão
importante: `Projeto.competencias` é construído como objeto simples indexado por
`Papel`, não como um `Map`, porque é assim que o código de produção realmente o lê
(ver bug #3 abaixo).

## O que é coberto (e por quê)

Os testes focam exclusivamente nos **modelos de domínio** (`src/Equipe/Modelo`,
`src/Projetos/Modelo`) e na lógica que opera sobre eles (`Strategy`, `Observer`,
`Visitor`, `SistemaRecomendacao`). Esse código é puro TypeScript, sem I/O, então dá
para testar de forma rápida e determinística, sem precisar de um banco Postgres.

| Classe | O que é testado |
|---|---|
| `SimiliaridadeCosseno` | Escolhe o profissional mais similar (cosseno) por papel; não repete profissional entre papéis. |
| `FiltragemColaborativa` | Escolhe quem tem maior média de nota naquele papel; não repete profissional entre papéis. |
| `RegrasOrcamento` | Preenche todos os 6 papéis quando o orçamento permite; nunca estoura o orçamento; nunca repete profissional. (Ver bug #1 — a otimização de nota, em si, está quebrada e não é testada como "correta".) |
| `NotificadorEmail`, `NotificadorInterno`, `AuditoriaRecomendacao` | Cada um loga a mensagem esperada ao receber um `EventoRecomendacao` (via spy em `console.log`). |
| `CalculadorCompatibilidade` | Média (arredondada) de notas de um profissional; array de médias por membro de uma equipe. |
| `GeradorRelatorio` | Texto do relatório contém os dados esperados do profissional/projeto. |
| `ValidadorConscistencia` | `true`/`false` corretos conforme competências do profissional / equipe do projeto. |
| `OrquestradorPadrao` (+ `OrquestradorEquipe`) | Monta `Equipe` com status `"formada"` e membros `confirmado: true`; chama `posProcessar`; lança erro quando falta a propriedade `competencias`; documenta o bug #2. |
| `SistemaRecomendacao` | `executarEstrategia` delega ao orquestrador, gera o `EventoRecomendacao` certo e notifica **todos** os observadores (os 3 padrão + os adicionados via `adicionarObeservador`). |

## O que **não** é coberto (fora do escopo)

- **`Entidades/*`** (TypeORM) e **`Repositorio/*`**: exigem uma conexão real com
  Postgres. Testá-los de forma unitária exigiria subir um banco (ou usar um
  `sqlite`/testcontainers em memória), o que está fora do escopo desta tarefa.
  Sugestão para evolução: testes de integração com Postgres via Docker (o próprio
  `docker-compose.yml` do projeto já sobe um Postgres) ou `better-sqlite3` como
  driver de teste do TypeORM.
- **`app.ts`** (bootstrap + seed) e **`controller/recomendacaoController.ts`**:
  dependem do Fastify e do banco inicializados. Sugestão: testes de integração
  HTTP com `fastify.inject()`, mockando `ServiceRecomendacao`.
- **`ServiceRecomendacao`**: faz a ponte entre Entidade (TypeORM) e Modelo de
  domínio; para testar isoladamente seria necessário mockar
  `ProfissionaisRepositorio` (por exemplo com `jest.mock`), o que não foi feito
  aqui para manter o foco na lógica de recomendação em si.

## Bugs encontrados durante a escrita dos testes

Os testes foram escritos para validar o **comportamento atual** do código, não para
"corrigir" a lógica por baixo dos panos. Isso expôs alguns problemas, também listados
no `readme.md` principal:

1. **`RegrasOrcamento` (`src/Strategy/RegrasOrcamento.ts`)** monta o modelo de
   programação linear com a chave `optmize` em vez de `optimize`. A biblioteca
   `javascript-lp-solver` ignora silenciosamente essa chave e não maximiza nenhuma
   função objetivo — ela apenas encontra uma solução viável qualquer que satisfaça
   as restrições (orçamento máximo e "exatamente 1 pessoa por papel"). Os testes de
   `RegrasOrcamento.test.ts` por isso verificam apenas que as **restrições** são
   respeitadas, não que a equipe de maior nota é escolhida.
2. **`OrquestradorEquipe.validarRestricoes`** (implementado em
   `OrquestradorPadrao.validarRestricoes`) usa `'competencias' in projeto`. Como o
   construtor de `Projeto` sempre atribui `this.competencias = competencias`
   (mesmo que `undefined`), essa checagem é **sempre `true`** para qualquer
   instância real de `Projeto` — o erro de validação amigável praticamente nunca
   dispara. Um teste em `OrquestradorPadrao.test.ts` reproduz isso: um `Projeto`
   real sem competências não lança o erro de validação, mas sim um `TypeError`
   mais adiante, dentro da estratégia (`Object.keys(undefined)`).
3. **Inconsistência de tipos em `Projeto.competencias`**: tipado como
   `Map<Papel, Array<Competencias>>`, mas lido pelas estratégias com
   `Object.keys(...)`/acesso por colchetes, que só funciona para objetos comuns
   (um `Map` real teria `Object.keys(map) === []`). Os testes usam objetos comuns
   (ver `tests/helpers/factories.ts`) para refletir o comportamento real.
4. **Erro de digitação no schema HTTP**: `recomendacaoController.ts` valida o campo
   `comepetencias` (não `competencias`) no corpo da requisição — não coberto por
   teste automatizado por depender do Fastify/HTTP (fora do escopo definido acima).
5. **Divisão por zero** em `FiltragemColaborativa`/`SimiliaridadeCosseno` quando um
   profissional não tem avaliações para o papel em questão, gerando `NaN`.
