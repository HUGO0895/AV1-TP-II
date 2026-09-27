import CalculadorCompatibilidade from "../../Visitor/CalculadorCompatibilidade";
import GeradorRelatorio from "../../Visitor/GeradorRelatorio";
import ValidadorConscistencia from "../../Visitor/ValidadorConscistencia";
import Equipe from "../../Equipe/Modelo/equipe";
import MembroEquipe from "../../Equipe/Modelo/membroEquipe";
import { Papel } from "../../Equipe/Enum/papel";
import {
  novoProfissional,
  novoProjeto,
  novaAvaliacao,
  novaCompetencia,
} from "../../helpers/factories";

describe("CalculadorCompatibilidade", () => {
  it("visitarProfissional retorna a média (arredondada para baixo) das notas do profissional", () => {
    const profissional = novoProfissional({
      id: "1",
      nome: "Ana",
      avaliacoes: [novaAvaliacao(5, Papel.DIRETOR), novaAvaliacao(4, Papel.EDITOR)],
    });

    const resultado = new CalculadorCompatibilidade().visitarProfissional(profissional);

    expect(resultado).toBe(4); // floor((5+4)/2) = floor(4.5) = 4
  });

  it("visitarProjeto retorna a média de notas de cada membro da equipe do projeto", () => {
    const ana = novoProfissional({
      id: "1",
      nome: "Ana",
      avaliacoes: [novaAvaliacao(5, Papel.DIRETOR), novaAvaliacao(3, Papel.EDITOR)],
    });
    const projeto = novoProjeto({});
    projeto.equipe = new Equipe(new Date(), "formada", [
      new MembroEquipe(Papel.DIRETOR, true, ana),
    ]);

    const resultado = new CalculadorCompatibilidade().visitarProjeto(projeto);

    expect(resultado).toEqual([4]); // (5+3)/2 = 4
  });
});

describe("GeradorRelatorio", () => {
  it("visitarProfissional inclui nome, preço médio e contagem de competências/avaliações", () => {
    const profissional = novoProfissional({
      id: "1",
      nome: "Ana",
      competencias: [novaCompetencia("Direção", 5)],
      avaliacoes: [novaAvaliacao(5, Papel.DIRETOR)],
      precoMedio: 3000,
    });

    const relatorio = new GeradorRelatorio().visitarProfissional(profissional);

    expect(relatorio).toContain("Ana");
    expect(relatorio).toContain("3000");
    expect(relatorio).toContain("Competências: 1");
    expect(relatorio).toContain("Avaliações: 1");
  });

  it("visitarProjeto inclui tipo, gênero, orçamento e prazo do projeto", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const projeto = novoProjeto({ orcamento: 50000 });
    projeto.equipe = new Equipe(new Date(), "formada", [
      new MembroEquipe(Papel.DIRETOR, true, ana),
    ]);

    const relatorio = new GeradorRelatorio().visitarProjeto(projeto);

    expect(relatorio).toContain(String(projeto.tipo));
    expect(relatorio).toContain(String(projeto.genero));
    expect(relatorio).toContain("50000");
  });
});

describe("ValidadorConscistencia", () => {
  it("visitarProfissional retorna true quando o profissional tem competências", () => {
    const profissional = novoProfissional({
      id: "1",
      nome: "Ana",
      competencias: [novaCompetencia("Direção", 5)],
    });

    expect(new ValidadorConscistencia().visitarProfissional(profissional)).toBe(true);
  });

  it("visitarProfissional retorna false quando o profissional não tem competências", () => {
    const profissional = novoProfissional({ id: "1", nome: "Ana", competencias: [] });

    expect(new ValidadorConscistencia().visitarProfissional(profissional)).toBe(false);
  });

  it("visitarProjeto retorna true quando o projeto tem uma equipe formada", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const projeto = novoProjeto({});
    projeto.equipe = new Equipe(new Date(), "formada", [
      new MembroEquipe(Papel.DIRETOR, true, ana),
    ]);

    expect(new ValidadorConscistencia().visitarProjeto(projeto)).toBe(true);
  });

  it("visitarProjeto retorna false quando a equipe do projeto está vazia", () => {
    const projeto = novoProjeto({});
    projeto.equipe = new Equipe(new Date(), "formada", []);

    expect(new ValidadorConscistencia().visitarProjeto(projeto)).toBe(false);
  });
});
