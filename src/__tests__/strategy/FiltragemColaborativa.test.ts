import FiltragemColaborativa from "../../Strategy/FiltragemColaborativa";
import { Papel } from "../../Equipe/Enum/papel";
import { novoProfissional, novoProjeto, novaAvaliacao } from "../../helpers/factories";

describe("FiltragemColaborativa", () => {
  it("escolhe, para cada papel, o profissional com maior média de notas nesse papel", () => {
    const ana = novoProfissional({
      id: "1",
      nome: "Ana",
      avaliacoes: [novaAvaliacao(5, Papel.DIRETOR), novaAvaliacao(4, Papel.DIRETOR)],
    });
    const bruno = novoProfissional({
      id: "2",
      nome: "Bruno",
      avaliacoes: [novaAvaliacao(2, Papel.DIRETOR)],
    });

    const projeto = novoProjeto({
      competenciasPorPapel: { [Papel.DIRETOR]: [] },
    });

    const estrategia = new FiltragemColaborativa();
    const resultado = estrategia.recomendar(projeto, [ana, bruno]);

    expect(resultado.get(Papel.DIRETOR)).toBe(ana);
  });

  it("não recomenda o mesmo profissional duas vezes entre papéis diferentes", () => {
    const ana = novoProfissional({
      id: "1",
      nome: "Ana",
      avaliacoes: [
        novaAvaliacao(5, Papel.DIRETOR),
        novaAvaliacao(5, Papel.EDITOR),
      ],
    });
    const bruno = novoProfissional({
      id: "2",
      nome: "Bruno",
      avaliacoes: [
        novaAvaliacao(3, Papel.DIRETOR),
        novaAvaliacao(3, Papel.EDITOR),
      ],
    });

    const projeto = novoProjeto({
      competenciasPorPapel: { [Papel.DIRETOR]: [], [Papel.EDITOR]: [] },
    });

    const estrategia = new FiltragemColaborativa();
    const resultado = estrategia.recomendar(projeto, [ana, bruno]);

    expect(resultado.get(Papel.DIRETOR)).toBe(ana);
    expect(resultado.get(Papel.EDITOR)).toBe(bruno);
  });
});
