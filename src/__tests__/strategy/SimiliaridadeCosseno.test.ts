import SimiliaridadeCosseno from "../../Strategy/SimiliaridadedeCosseno";
import { Papel } from "../../Equipe/Enum/papel";
import { novoProfissional, novoProjeto, novaCompetencia } from "../../helpers/factories";

describe("SimiliaridadeCosseno", () => {
  it("escolhe, para cada papel, o profissional com maior similaridade de cosseno", () => {
    const direcao = novaCompetencia("Direção", 5);
    const fotografia = novaCompetencia("Fotografia", 5);

    // Ana é forte em Direção, fraca em Fotografia.
    const ana = novoProfissional({
      id: "1",
      nome: "Ana",
      competencias: [novaCompetencia("Direção", 5), novaCompetencia("Fotografia", 1)],
    });

    // Bruno é forte em Fotografia, fraco em Direção.
    const bruno = novoProfissional({
      id: "2",
      nome: "Bruno",
      competencias: [novaCompetencia("Direção", 1), novaCompetencia("Fotografia", 5)],
    });

    const projeto = novoProjeto({
      competenciasPorPapel: {
        [Papel.DIRETOR]: [direcao],
        [Papel.DIRETOR_FOTOGRAFIA]: [fotografia],
      },
    });

    const estrategia = new SimiliaridadeCosseno();
    const resultado = estrategia.recomendar(projeto, [ana, bruno]);

    expect(resultado.get(Papel.DIRETOR)).toBe(ana);
    expect(resultado.get(Papel.DIRETOR_FOTOGRAFIA)).toBe(bruno);
  });

  it("não recomenda o mesmo profissional para dois papéis diferentes", () => {
    // Um único profissional muito bom em tudo.
    const generalista = novoProfissional({
      id: "1",
      nome: "Generalista",
      competencias: [novaCompetencia("Direção", 5), novaCompetencia("Edição", 5)],
    });
    const fraco = novoProfissional({
      id: "2",
      nome: "Fraco",
      competencias: [novaCompetencia("Direção", 1), novaCompetencia("Edição", 1)],
    });

    const projeto = novoProjeto({
      competenciasPorPapel: {
        [Papel.DIRETOR]: [novaCompetencia("Direção", 5)],
        [Papel.EDITOR]: [novaCompetencia("Edição", 5)],
      },
    });

    const estrategia = new SimiliaridadeCosseno();
    const resultado = estrategia.recomendar(projeto, [generalista, fraco]);

    // O generalista só pode ocupar um papel; o segundo fica para o "fraco".
    const escolhidos = Array.from(resultado.values());
    expect(escolhidos).toContain(generalista);
    expect(new Set(escolhidos).size).toBe(2);
  });
});
