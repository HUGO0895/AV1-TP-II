import RegrasOrcamento from "../../Strategy/RegrasOrcamento";
import { Papel } from "../../Equipe/Enum/papel";
import { novoProfissional, novoProjeto, novaAvaliacao } from "../../helpers/factories";

describe("RegrasOrcamento", () => {
  it("preenche apenas os papéis pedidos pelo projeto (competencias), não todos do enum", () => {
    const papeisPedidos = [Papel.DIRETOR, Papel.EDITOR];

    const profissionais = [
      novoProfissional({
        id: "1",
        nome: "Profissional Diretor",
        precoMedio: 1000,
        avaliacoes: [novaAvaliacao(5, Papel.DIRETOR)],
      }),
      novoProfissional({
        id: "2",
        nome: "Profissional Editor",
        precoMedio: 1000,
        avaliacoes: [novaAvaliacao(5, Papel.EDITOR)],
      }),
      // Este profissional não atua em nenhum papel pedido pelo projeto
      novoProfissional({
        id: "3",
        nome: "Profissional Sonoplasta",
        precoMedio: 1000,
        avaliacoes: [novaAvaliacao(5, Papel.SONOPLASTA)],
      }),
    ];

    const projeto = novoProjeto({
      orcamento: 100000,
      competenciasPorPapel: {
        [Papel.DIRETOR]: [],
        [Papel.EDITOR]: [],
      },
    });

    const resultado = new RegrasOrcamento().recomendar(projeto, profissionais);

    expect(resultado.size).toBe(papeisPedidos.length);
    for (const papel of papeisPedidos) {
      expect(resultado.has(papel)).toBe(true);
    }
    // Nenhum papel fora do que foi pedido deve aparecer
    expect(resultado.has(Papel.SONOPLASTA)).toBe(false);
  });

  it("nunca escolhe uma equipe cujo custo total ultrapasse o orçamento do projeto", () => {
    const profissionais = [
      novoProfissional({
        id: "1",
        nome: "Profissional Diretor",
        precoMedio: 1000,
        avaliacoes: [novaAvaliacao(5, Papel.DIRETOR)],
      }),
      novoProfissional({
        id: "2",
        nome: "Profissional Editor",
        precoMedio: 1000,
        avaliacoes: [novaAvaliacao(5, Papel.EDITOR)],
      }),
    ];

    const projeto = novoProjeto({
      orcamento: 100000,
      competenciasPorPapel: {
        [Papel.DIRETOR]: [],
        [Papel.EDITOR]: [],
      },
    });

    const resultado = new RegrasOrcamento().recomendar(projeto, profissionais);

    const custoTotal = Array.from(resultado.values()).reduce(
      (soma, prof) => soma + prof.precoMedio,
      0
    );
    expect(custoTotal).toBeLessThanOrEqual(projeto.orcamento);
  });

  it("não escolhe o mesmo profissional para mais de um papel", () => {
    // Cenário anterior usava 1 único profissional versátil para 2 papéis
    // pedidos — isso torna o modelo do solver matematicamente inviável
    // (força a mesma variável a valer 1 em duas restrições "equal:1" que
    // juntas violam a restrição "1_max: max:1"), e o código não filtrava
    // variáveis por valor selecionado (ver bug corrigido em RegrasOrcamento.ts:
    // agora só considera a variável quando seu valor resolvido é === 1).
    // Aqui usamos 2 profissionais versáteis, cenário factível, onde a
    // dedupe de fato precisa ocorrer entre eles.
    const versatilA = novoProfissional({
      id: "1",
      nome: "Versátil A",
      precoMedio: 1000,
      avaliacoes: [
        novaAvaliacao(5, Papel.DIRETOR),
        novaAvaliacao(3, Papel.EDITOR),
      ],
    });
    const versatilB = novoProfissional({
      id: "2",
      nome: "Versátil B",
      precoMedio: 1000,
      avaliacoes: [
        novaAvaliacao(3, Papel.DIRETOR),
        novaAvaliacao(5, Papel.EDITOR),
      ],
    });

    const projeto = novoProjeto({
      orcamento: 100000,
      competenciasPorPapel: {
        [Papel.DIRETOR]: [],
        [Papel.EDITOR]: [],
      },
    });

    const resultado = new RegrasOrcamento().recomendar(projeto, [versatilA, versatilB]);

    const idsEscolhidos = Array.from(resultado.values()).map((p) => p.getId());
    expect(new Set(idsEscolhidos).size).toBe(idsEscolhidos.length);
    expect(resultado.size).toBe(2);
  });

  it("com o typo 'optmize' corrigido, escolhe o profissional com melhor avaliação quando há concorrência pelo mesmo papel", () => {
    const profissionalRuim = novoProfissional({
      id: "1",
      nome: "Profissional Nota Baixa",
      precoMedio: 1000,
      avaliacoes: [novaAvaliacao(2, Papel.DIRETOR)],
    });
    const profissionalBom = novoProfissional({
      id: "2",
      nome: "Profissional Nota Alta",
      precoMedio: 1000,
      avaliacoes: [novaAvaliacao(5, Papel.DIRETOR)],
    });

    const projeto = novoProjeto({
      orcamento: 100000,
      competenciasPorPapel: {
        [Papel.DIRETOR]: [],
      },
    });

    const resultado = new RegrasOrcamento().recomendar(
      projeto,
      [profissionalRuim, profissionalBom]
    );

    expect(resultado.get(Papel.DIRETOR)?.getId()).toBe("2");
  });
});