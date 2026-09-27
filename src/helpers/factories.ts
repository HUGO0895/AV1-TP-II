import Profissional from "../Equipe/Modelo/Profissional";
import Competencias from "../Equipe/Modelo/Competencias";
import Avaliacao from "../Equipe/Modelo/Avaliacao";
import Projeto from "../Projetos/Modelo/projetos";
import { Papel } from "../Equipe/Enum/papel";
import { Genero } from "../Projetos/Enum/TipoGenero";
import { TipoProjeto } from "../Projetos/Enum/TipoProjeto";
import { Intervalo } from "../Equipe/Types/intervalo";

/**
 * Fábricas de objetos de domínio usadas pelos testes.
 *
 * IMPORTANTE: apesar de `Projeto.competencias` ser tipado como
 * `Map<Papel, Array<Competencias>>`, as estratégias (Strategy/*) leem esse
 * campo com `Object.keys(projeto.competencias)` e `projeto.competencias[x]`,
 * ou seja, tratam o campo como um OBJETO comum, não como um `Map` de fato
 * (um `Map` real nunca teria chaves enumeráveis por `Object.keys`). Por isso,
 * aqui construímos `competencias` como um objeto simples indexado por Papel,
 * que é o formato que o código realmente espera em tempo de execução.
 * Veja docs/TESTES.md para mais detalhes sobre essa inconsistência.
 */

export function novaCompetencia(nome: string, nivel: number): Competencias {
  // Atenção à ordem invertida do construtor: (nivel, nome).
  return new Competencias(nivel, nome);
}

export function novoIntervalo(inicioISO: string, fimISO: string): Intervalo {
  return { inicio: new Date(inicioISO), final: new Date(fimISO) };
}

export function novaAvaliacao(
  nota: number,
  papel: Papel,
  comentario = "ok",
  data = new Date("2026-01-01"),
  projeto: Projeto | null = null
): Avaliacao {
  return new Avaliacao(nota, comentario, data, papel, projeto as any);
}

export function novoProfissional(opts: {
  id: string;
  nome: string;
  competencias?: Competencias[];
  disponibilidade?: Intervalo;
  precoMedio?: number;
  avaliacoes?: Avaliacao[];
}): Profissional {
  return new Profissional(
    opts.id,
    opts.nome,
    opts.competencias ?? [],
    opts.disponibilidade ?? novoIntervalo("2026-01-01", "2026-12-31"),
    opts.precoMedio ?? 1000,
    opts.avaliacoes ?? []
  );
}

export function novoProjeto(opts: {
  id?: string;
  genero?: Genero;
  duracaoMin?: number;
  orcamento?: number;
  prazo?: Date;
  tipo?: TipoProjeto;

 competenciasPorPapel?: Partial<Record<Papel, Competencias[]>>;
}): Projeto {
  const competenciasMap = new Map(
    Object.entries(opts.competenciasPorPapel ?? {})
  );
  return new Projeto(
    opts.id ?? "p1",
    opts.genero ?? Genero.DRAMA,
    opts.duracaoMin ?? 90,
    opts.orcamento ?? 100000,
    opts.prazo ?? new Date("2026-06-01"),
    opts.tipo ?? TipoProjeto.FICCAO,
    competenciasMap as any
  );
}
