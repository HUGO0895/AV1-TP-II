import SistemaRecomendacao from "../../SistemaRecomendacao/SistemaRecomendacao";
import RecomendacaoStrategy from "../../Strategy/RecomendacaoStrategy";
import Observador from "../../Observer/Observador";
import EventoRecomendacao from "../../Observer/EventoRecomendacao";
import { Papel } from "../../Equipe/Enum/papel";
import { novoProfissional, novoProjeto } from "../../helpers/factories";

describe("SistemaRecomendacao", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("executarEstrategia monta a equipe usando a estratégia definida e notifica os observadores", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const estrategiaFake: RecomendacaoStrategy = {
      recomendar: jest.fn().mockReturnValue(new Map([[Papel.DIRETOR, ana]])),
    };
    const projeto = novoProjeto({ competenciasPorPapel: { [Papel.DIRETOR]: [] } });

    const observadorEspiao: Observador = { atualizar: jest.fn() };

    const sistema = new SistemaRecomendacao();
    sistema.adicionarObeservador(observadorEspiao);
    sistema.definirEstrategiaAtual(estrategiaFake);

    const equipe = sistema.executarEstrategia(projeto, [ana]);

    expect(equipe.membrosEquipe[0].profissional).toBe(ana);
    expect(observadorEspiao.atualizar).toHaveBeenCalledTimes(1);

    const eventoRecebido = (observadorEspiao.atualizar as jest.Mock).mock
      .calls[0][0] as EventoRecomendacao;
    expect(eventoRecebido.tipo).toBe("Recomendação de Equipe");
    expect(eventoRecebido.origem).toBe("Sistema Recomendação");
    expect(eventoRecebido.dados).toBe(equipe);
  });

  it("notifica também os observadores padrão (email, interno, auditoria) via console.log", () => {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const estrategiaFake: RecomendacaoStrategy = {
      recomendar: jest.fn().mockReturnValue(new Map([[Papel.DIRETOR, ana]])),
    };
    const projeto = novoProjeto({ competenciasPorPapel: { [Papel.DIRETOR]: [] } });

    const sistema = new SistemaRecomendacao();
    sistema.definirEstrategiaAtual(estrategiaFake);
    sistema.executarEstrategia(projeto, [ana]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NOTIFICADOR-EMAIL"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NOTIFICADOR-INTERNO"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("LOG AUDITORIA"));
  });

  it("adicionarObeservador permite plugar novos observadores sem alterar os existentes", () => {
    const sistema = new SistemaRecomendacao();
    const observador1: Observador = { atualizar: jest.fn() };
    const observador2: Observador = { atualizar: jest.fn() };

    sistema.adicionarObeservador(observador1);
    sistema.adicionarObeservador(observador2);

    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const estrategiaFake: RecomendacaoStrategy = {
      recomendar: jest.fn().mockReturnValue(new Map([[Papel.DIRETOR, ana]])),
    };
    const projeto = novoProjeto({ competenciasPorPapel: { [Papel.DIRETOR]: [] } });

    sistema.definirEstrategiaAtual(estrategiaFake);
    sistema.executarEstrategia(projeto, [ana]);

    expect(observador1.atualizar).toHaveBeenCalledTimes(1);
    expect(observador2.atualizar).toHaveBeenCalledTimes(1);
  });
});
