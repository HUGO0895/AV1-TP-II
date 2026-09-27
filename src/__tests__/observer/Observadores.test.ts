import AuditoriaRecomendacao from "../../Observer/AuditoriaRecomendacao";
import NotificadorEmail from "../../Observer/NotificadorEmail";
import NotificadorInterno from "../../Observer/NotificadorInterno";
import EventoRecomendacao from "../../Observer/EventoRecomendacao";
import Equipe from "../../Equipe/Modelo/equipe";
import MembroEquipe from "../../Equipe/Modelo/membroEquipe";
import { Papel } from "../../Equipe/Enum/papel";
import { novoProfissional } from "../../helpers/factories";

describe("Observadores de EventoRecomendacao", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  function montarEvento() {
    const ana = novoProfissional({ id: "1", nome: "Ana" });
    const membro = new MembroEquipe(Papel.DIRETOR, true, ana);
    const equipe = new Equipe(new Date("2026-01-01"), "formada", [membro]);
    return new EventoRecomendacao("Recomendação de Equipe", equipe, "Sistema Recomendação");
  }

  it("NotificadorEmail loga uma mensagem de envio para cada membro da equipe", () => {
    const evento = montarEvento();
    new NotificadorEmail().atualizar(evento);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Ana"));
  });

  it("NotificadorInterno loga que os dados foram enviados aos serviços internos", () => {
    new NotificadorInterno().atualizar(montarEvento());

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("serviços internos")
    );
  });

  it("AuditoriaRecomendacao loga os dados e a origem do evento", () => {
    const evento = montarEvento();
    new AuditoriaRecomendacao().atualizar(evento);

    const chamadas = logSpy.mock.calls.flat();
    expect(chamadas.some((c) => typeof c === "string" && c.includes("Origem:Sistema Recomendação"))).toBe(true);
  });
});
