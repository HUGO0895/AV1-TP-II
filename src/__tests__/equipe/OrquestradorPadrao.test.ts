import OrquestradorPadrao from "../../Equipe/Modelo/OrquestradorPadrao";
import RecomendacaoStrategy from "../../Strategy/RecomendacaoStrategy";
import { Papel } from "../../Equipe/Enum/papel";
import Projeto from "../../Projetos/Modelo/projetos";
import { novoProfissional, novoProjeto } from "../../helpers/factories";

describe("OrquestradorPadrao", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("orquestrar monta uma Equipe 'formada' a partir da estratégia informada", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const mapa = new Map([[Papel.DIRETOR, ana]]);
    const estrategiaFake: RecomendacaoStrategy = {
      recomendar: jest.fn().mockReturnValue(mapa),
    };
    const projeto = novoProjeto({ competenciasPorPapel: { [Papel.DIRETOR]: [] } });

    const equipe = new OrquestradorPadrao().orquestrar(projeto, estrategiaFake, [ana]);

    expect(equipe.status).toBe("formada");
    expect(equipe.membrosEquipe).toHaveLength(1);
    expect(equipe.membrosEquipe[0].papel).toBe(Papel.DIRETOR);
    expect(equipe.membrosEquipe[0].confirmado).toBe(true);
    expect(equipe.membrosEquipe[0].profissional).toBe(ana);
    expect(estrategiaFake.recomendar).toHaveBeenCalledWith(projeto, [ana]);
  });

  it("posProcessar é chamado (loga a equipe processada) após orquestrar", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const estrategiaFake: RecomendacaoStrategy = {
      recomendar: jest.fn().mockReturnValue(new Map([[Papel.DIRETOR, ana]])),
    };
    const projeto = novoProjeto({ competenciasPorPapel: { [Papel.DIRETOR]: [] } });

    new OrquestradorPadrao().orquestrar(projeto, estrategiaFake, [ana]);

    expect(logSpy).toHaveBeenCalledWith("Processando:");
  });

  it(
    "lança um erro quando o projeto não é uma instância válida (sem a propriedade competencias)",
    () => {
      const projetoInvalido = {} as unknown as Projeto;
      const estrategiaFake: RecomendacaoStrategy = { recomendar: jest.fn() };

      expect(() =>
        new OrquestradorPadrao().orquestrar(projetoInvalido, estrategiaFake, [])
      ).toThrow("O projeto não possui competencias");
    }
  );

  it(
    "BUG CONHECIDO: validarRestricoes sempre retorna true para um Projeto real, mesmo sem competências definidas " +
      "(o campo 'competencias' sempre existe na instância, só o valor é undefined) — o erro só aparece mais tarde, " +
      "quando a estratégia tenta ler projeto.competencias",
    () => {
      const projetoSemCompetencias = novoProjeto({}); // competenciasPorPapel não informado
      const estrategiaFake: RecomendacaoStrategy = {
        recomendar: jest.fn(() => {
          // Reproduz o que as estratégias reais fazem: Object.keys(undefined) lança TypeError.
          Object.keys((projetoSemCompetencias as any).competencias);
          return new Map();
        }),
      };

      expect(() =>
        new OrquestradorPadrao().orquestrar(projetoSemCompetencias, estrategiaFake, [])
      ).toThrow(Error);
    }
  );
});
