import "reflect-metadata"
import fastify from "fastify";
// Principe que nunca virou rei
import { AppDataSource } from "./ConecBanco";
import { Profissional } from "./Entidades/Profissionais";
import { Competencias } from "./Entidades/Competencias";
import { CompetenciasProfissionais } from "./Entidades/CompetenciaProfissional";
import { Projetos } from "./Entidades/Projeto";
import { Avaliacao } from "./Entidades/Avaliacao";
import { Recomendacao } from "./Entidades/Recomendacao";
import { RecomendacaoProfissionais } from "./Entidades/RecomendacaoProfissionais";
import { Papel } from "./Equipe/Enum/papel";
// ATENÇÃO: não tive acesso ao arquivo TipoProjeto.ts. Os valores abaixo foram
// inferidos da migration (InitSchema1788906230554). Se os nomes dos membros do
// enum no seu arquivo forem diferentes, ajuste as linhas marcadas com "TODO".
import { TipoProjeto } from "./Projetos/Enum/TipoProjeto";
// TODO: se quiser usar o enum Genero (COMEDIA, AÇÃO, TERROR, DRAMA) no campo
// "genero" dos projetos, o campo hoje é `string` na entidade Projetos — dá pra
// deixar como string mesmo (é o que o schema atual espera) ou trocar a coluna
// pra usar o enum. Não mexi nisso aqui pra não sair do escopo do seed.
import { projetoRecomendacao } from "./controller/recomendacaoController";
import { RecomendacaoController } from "./controller/recomendacaoController"

const app = fastify({ logger: true })

app.post('/', { schema: projetoRecomendacao }, RecomendacaoController.Recomendar)

async function seedDatabase(): Promise<void> {
  const profissionalRepo = AppDataSource.getRepository(Profissional);
  const competenciaRepo = AppDataSource.getRepository(Competencias);
  const competenciaProfissionalRepo = AppDataSource.getRepository(CompetenciasProfissionais);
  const projetoRepo = AppDataSource.getRepository(Projetos);
  const avaliacaoRepo = AppDataSource.getRepository(Avaliacao);
  const recomendacaoRepo = AppDataSource.getRepository(Recomendacao);
  const recomendacaoProfissionalRepo = AppDataSource.getRepository(RecomendacaoProfissionais);

  const jaExisteDado = await profissionalRepo.count();
  if (jaExisteDado > 0) {
    app.log.info("[seed] Banco já populado, pulando seed.");
    return;
  }

  app.log.info("[seed] Populando banco de dados...");

  // ---------- Competências (10) ----------
  const nomesCompetencias = [
    "Direção",
    "Roteiro",
    "Edição",
    "Fotografia",
    "Som",
    "Efeitos Visuais",
    "Produção",
    "Animação 3D",
    "Maquiagem",
    "Continuidade",
  ];

  const competencias = await competenciaRepo.save(
    nomesCompetencias.map((nome) => competenciaRepo.create({ nome }))
  );

  // ---------- Profissionais (32) ----------
  const primeirosNomes = [
    "Ana", "Carlos", "Fernanda", "João", "Mariana", "Rafael", "Juliana", "Lucas",
    "Beatriz", "Pedro", "Camila", "Gustavo", "Larissa", "Thiago", "Patrícia",
    "Bruno", "Aline", "Diego", "Renata", "Marcelo", "Isabela", "Rodrigo",
    "Vanessa", "Fábio", "Letícia", "André", "Priscila", "Eduardo", "Tatiane",
    "Vinícius", "Gabriela", "Felipe",
  ];
  const sobrenomes = [
    "Souza", "Lima", "Costa", "Almeida", "Ribeiro", "Martins", "Pereira",
    "Oliveira", "Fernandes", "Carvalho", "Gomes", "Barbosa", "Rocha", "Dias",
    "Teixeira", "Nascimento", "Araújo", "Melo", "Cardoso", "Correia",
  ];

  const quantidadeProfissionais = 32;
  const dadosProfissionais: {
    nome: string;
    disponibilidadeInicio: Date;
    disponibilidadeFinal: Date;
    precoMedio: number;
  }[] = [];

  for (let i = 0; i < quantidadeProfissionais; i++) {
    const primeiro = primeirosNomes[i % primeirosNomes.length];
    const sobrenome = sobrenomes[(i * 3 + 1) % sobrenomes.length];
    const mesInicio = (i % 12) + 1;
    dadosProfissionais.push({
      nome: `${primeiro} ${sobrenome}`,
      disponibilidadeInicio: new Date(2026, mesInicio - 1, 1),
      disponibilidadeFinal: new Date(2026, (mesInicio + 5) % 12, 28),
      precoMedio: 3000 + (i % 10) * 700,
    });
  }

  const profissionaisSalvos: Profissional[] = [];
  for (const dado of dadosProfissionais) {
    const profissional = await profissionalRepo.save(
      profissionalRepo.create(dado)
    );
    profissionaisSalvos.push(profissional);
  }

  // cada profissional recebe 2 competências (índices consecutivos, cíclico) com nível 1-5
  for (const [i, profissional] of profissionaisSalvos.entries()) {
    const competenciaA = competencias[i % competencias.length];
    const competenciaB = competencias[(i + 3) % competencias.length];

    await competenciaProfissionalRepo.save([
      competenciaProfissionalRepo.create({
        competencia: competenciaA,
        nivel: (i % 5) + 1,
        profissional,
      }),
      competenciaProfissionalRepo.create({
        competencia: competenciaB,
        nivel: ((i + 2) % 5) + 1,
        profissional,
      }),
    ]);
  }

  // ---------- Projetos (10) ----------
  const generosProjeto = ["Drama", "Natureza", "Infantil", "Biografia", "Ficção Científica", "Comédia", "Terror", "Ação", "Musical", "Suspense"];
  const tiposProjeto = [TipoProjeto.FICCAO, TipoProjeto.DOCUMENTARIO, TipoProjeto.ANIMACAO];

  const quantidadeProjetos = 10;
  const dadosProjetos: {
    genero: string;
    duracaoMin: number;
    orcamento: number;
    prazo: Date;
    tipo: TipoProjeto;
  }[] = [];

  for (let i = 0; i < quantidadeProjetos; i++) {
    dadosProjetos.push({
      genero: generosProjeto[i % generosProjeto.length],
      duracaoMin: 60 + (i % 6) * 15,
      orcamento: 150000 + i * 100000,
      prazo: new Date(2026, i % 12, (i % 27) + 1),
      tipo: tiposProjeto[i % tiposProjeto.length],
    });
  }

  const projetosSalvos = await projetoRepo.save(
    dadosProjetos.map((p) => projetoRepo.create(p))
  );

  // ---------- Avaliações ----------
  const papeis = Object.values(Papel);
  const comentarios = [
    "Excelente entrega, superou as expectativas.",
    "Bom trabalho, mas atrasou um pouco o cronograma.",
    "Profissional muito dedicado e atencioso aos detalhes.",
    "Entrega dentro do prazo, qualidade satisfatória.",
    "Ótima comunicação durante todo o projeto.",
    "Trabalho competente, recontrataria sem dúvidas.",
  ];

  // cada profissional recebe exatamente 5 avaliações, distribuídas entre os
  // 5 projetos e os 6 papéis (rotacionando os índices pra variar projeto/papel/nota)
  let contadorAvaliacao = 0;
  for (const [i, profissional] of profissionaisSalvos.entries()) {
    for (let j = 0; j < 5; j++) {
      const projeto = projetosSalvos[(i + j) % projetosSalvos.length];
      const papel = papeis[(i + j) % papeis.length];

      await avaliacaoRepo.save(
        avaliacaoRepo.create({
          notaDoProfissional: 1 + ((i + j) % 5), // nota entre 1 e 5
          comentario: comentarios[(i + j) % comentarios.length],
          data: new Date(),
          profissional,
          ProjetoAvaliador: projeto,
          papel,
        })
      );
      contadorAvaliacao++;
    }
  }

  // ---------- Recomendação (1 apenas) ----------
  const projetoRecomendado = projetosSalvos[0];
  const recomendacao = await recomendacaoRepo.save(
    recomendacaoRepo.create({ projeto: projetoRecomendado })
  );

  // indica 5 profissionais nessa única recomendação
  const indicados = [
    profissionaisSalvos[0],
    profissionaisSalvos[5],
    profissionaisSalvos[10],
    profissionaisSalvos[15],
    profissionaisSalvos[20],
  ];

  await recomendacaoProfissionalRepo.save(
    indicados.map((profissional) =>
      recomendacaoProfissionalRepo.create({
        Recomendacao: recomendacao,
        profissional,
      })
    )
  );

  app.log.info(
    `[seed] Concluído: ${profissionaisSalvos.length} profissionais, ${competencias.length} competências, ${projetosSalvos.length} projetos, ${contadorAvaliacao} avaliações e 1 recomendação (com ${indicados.length} profissionais indicados) criadas.`
  );
}

async function bootstrap() {
  await AppDataSource.initialize()
  app.log.info("Conexão com o banco de dados estabelecida.")

  await seedDatabase()

  await app.listen({ port: 3000 })
}

bootstrap().catch((err) => {
  app.log.error(err)
  process.exit(1)
})
