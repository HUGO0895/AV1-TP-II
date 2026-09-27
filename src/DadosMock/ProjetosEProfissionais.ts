import { mock } from "jest-mock-extended";
import Equipe from "../../Equipe/Modelo/equipe";
import OrquestradorPadrao from "../../Equipe/Modelo/OrquestradorPadrao";
import Projeto from "../../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "../../Strategy/RecomendacaoStrategy";
import Profissional from "../../Equipe/Modelo/Profissional";
import { Papel } from "../../Equipe/Enum/papel";
import Competencias from "../../Equipe/Modelo/Competencias";
import SimiliaridadeCosseno from "../../Strategy/SimiliaridadedeCosseno";
import { TipoProjeto } from "../../Projetos/Enum/TipoProjeto";
import { Genero } from "../../Projetos/Enum/TipoGenero";
import Avaliacao from "../../Equipe/Modelo/Avaliacao";
import { Intervalo } from "../../Equipe/Types/intervalo";
import MembroEquipe from "../../Equipe/Modelo/membroEquipe";


 

const projetoAnterior01 = new Projeto(
    'proj-a01',
    Genero.DRAMA,
    90,
    300000,
    new Date('2025-06-01'),
    TipoProjeto.DOCUMENTARIO
)
 
const projetoAnterior02 = new Projeto(
    'proj-a02',
    Genero.COMEDIA,
    100,
    800000,
    new Date('2025-08-15'),
    TipoProjeto.FICCAO
)
 
const projetoAnterior03 = new Projeto(
    'proj-a03',
    Genero.TERROR,
    95,
    600000,
    new Date('2025-10-01'),
    TipoProjeto.FICCAO
)
 
const projetoAnterior04 = new Projeto(
    'proj-a04',
    Genero.DRAMA,
    80,
    450000,
    new Date('2025-11-20'),
    TipoProjeto.ANIMACAO
)
 
const projetoAnterior05 = new Projeto(
    'proj-a05',
    Genero.ACAO,
    110,
    700000,
    new Date('2026-01-10'),
    TipoProjeto.DOCUMENTARIO
)
 
// ---------------- PROFISSIONAL 01 ----------------
const profissional01 = new Profissional(
    'prof-001',
    'Ana Oliveira',
    [new Competencias(5, 'Direção de Atores'), new Competencias(4, 'Visão Criativa')],
    { inicio: new Date('2026-10-01'), final: new Date('2027-03-01') } as Intervalo,
    6000,
    [
        new Avaliacao(4.8, 'Excelente direção, elenco muito bem conduzido.', new Date('2026-05-10'), Papel.DIRETOR, projetoAnterior01),
        new Avaliacao(4.5, 'Cumpriu todos os prazos combinados.', new Date('2026-07-02'), Papel.DIRETOR, projetoAnterior02),
    ]
)
 

const profissional02 = new Profissional(
    'prof-002',
    'Bruno Santos',
    [new Competencias(5, 'Iluminação'), new Competencias(4, 'Enquadramento')],
    { inicio: new Date('2026-10-05'), final: new Date('2027-02-20') } as Intervalo,
    4800,
    [
        new Avaliacao(4.2, 'Ótimo trabalho de fotografia, cenas muito bem iluminadas.', new Date('2026-05-15'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior02),
        new Avaliacao(4.0, 'Boa parceria com a direção durante as gravações.', new Date('2026-07-10'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior03),
    ]
)
 

const profissional03 = new Profissional(
    'prof-003',
    'Carla Mendes',
    [new Competencias(4, 'Captação de Áudio'), new Competencias(5, 'Mixagem')],
    { inicio: new Date('2026-09-20'), final: new Date('2027-01-30') } as Intervalo,
    3200,
    [
        new Avaliacao(4.6, 'Áudio impecável em todas as cenas externas.', new Date('2026-04-28'), Papel.SONOPLASTA, projetoAnterior03),
        new Avaliacao(4.3, 'Muito atenta a ruídos de fundo.', new Date('2026-06-18'), Papel.SONOPLASTA, projetoAnterior04),
    ]
)
 

const profissional04 = new Profissional(
    'prof-004',
    'Diego Ferreira',
    [new Competencias(5, 'Montagem'), new Competencias(4, 'Color Grading')],
    { inicio: new Date('2026-11-01'), final: new Date('2027-04-01') } as Intervalo,
    5200,
    [
        new Avaliacao(4.7, 'Edição dinâmica, ritmo perfeito para o gênero de ação.', new Date('2026-08-01'), Papel.EDITOR, projetoAnterior04),
        new Avaliacao(4.4, 'Entregou os cortes antes do prazo.', new Date('2026-09-05'), Papel.EDITOR, projetoAnterior05),
    ]
)
 

const profissional05 = new Profissional(
    'prof-005',
    'Elisa Rocha',
    [new Competencias(5, 'Estrutura Narrativa'), new Competencias(4, 'Diálogos')],
    { inicio: new Date('2026-08-15'), final: new Date('2026-12-15') } as Intervalo,
    4000,
    [
        new Avaliacao(4.9, 'Roteiro muito bem estruturado, diálogos naturais.', new Date('2026-03-20'), Papel.ROTEITISTA, projetoAnterior05),
        new Avaliacao(4.6, 'Ótima capacidade de revisão sob prazo curto.', new Date('2026-05-01'), Papel.ROTEITISTA, projetoAnterior01),
    ]
)
 

const profissional06 = new Profissional(
    'prof-006',
    'Fábio Almeida',
    [new Competencias(5, 'Composição VFX'), new Competencias(4, 'Animação 3D')],
    { inicio: new Date('2026-11-10'), final: new Date('2027-05-10') } as Intervalo,
    7000,
    [
        new Avaliacao(4.5, 'Efeitos visuais de altíssima qualidade.', new Date('2026-08-20'), Papel.EFEITOS_VISUAIS, projetoAnterior01),
        new Avaliacao(4.1, 'Alguns atrasos na entrega das cenas finais.', new Date('2026-09-25'), Papel.EFEITOS_VISUAIS, projetoAnterior03),
    ]
)
 

const profissional07 = new Profissional(
    'prof-007',
    'Gabriela Costa',
    [new Competencias(4, 'Direção de Atores'), new Competencias(3, 'Visão Criativa')],
    { inicio: new Date('2026-09-01'), final: new Date('2027-02-01') } as Intervalo,
    5500,
    [
        new Avaliacao(4.0, 'Boa direção, ainda em desenvolvimento de estilo próprio.', new Date('2026-04-10'), Papel.DIRETOR, projetoAnterior02),
        new Avaliacao(3.8, 'Comunicação clara com o elenco.', new Date('2026-06-01'), Papel.DIRETOR, projetoAnterior04),
    ]
)
 

const profissional08 = new Profissional(
    'prof-008',
    'Henrique Lima',
    [new Competencias(4, 'Iluminação'), new Competencias(3, 'Enquadramento')],
    { inicio: new Date('2026-10-20'), final: new Date('2027-03-20') } as Intervalo,
    4200,
    [
        new Avaliacao(3.9, 'Trabalho competente, sem grandes destaques.', new Date('2026-05-05'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior03),
        new Avaliacao(4.1, 'Boa adaptação a cenários externos difíceis.', new Date('2026-07-15'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior05),
    ]
)
 

const profissional09 = new Profissional(
    'prof-009',
    'Isabela Martins',
    [new Competencias(5, 'Captação de Áudio'), new Competencias(4, 'Mixagem')],
    { inicio: new Date('2026-09-10'), final: new Date('2027-01-10') } as Intervalo,
    3400,
    [
        new Avaliacao(4.4, 'Muito cuidadosa com microfones em cena.', new Date('2026-04-22'), Papel.SONOPLASTA, projetoAnterior04),
        new Avaliacao(4.2, 'Boa entrega mesmo em locação com muito vento.', new Date('2026-06-30'), Papel.SONOPLASTA, projetoAnterior01),
    ]
)
 
// ---------------- PROFISSIONAL 10 ----------------
const profissional10 = new Profissional(
    'prof-010',
    'João Pedro Souza',
    [new Competencias(4, 'Montagem'), new Competencias(5, 'Color Grading')],
    { inicio: new Date('2026-11-05'), final: new Date('2027-04-05') } as Intervalo,
    5000,
    [
        new Avaliacao(4.3, 'Excelente tratamento de cor, deu identidade visual ao filme.', new Date('2026-08-10'), Papel.EDITOR, projetoAnterior05),
        new Avaliacao(4.0, 'Cumpriu o cronograma de entregas parciais.', new Date('2026-09-12'), Papel.EDITOR, projetoAnterior02),
    ]
)
 
// ---------------- PROFISSIONAL 11 ----------------
const profissional11 = new Profissional(
    'prof-011',
    'Karina Ribeiro',
    [new Competencias(4, 'Estrutura Narrativa'), new Competencias(3, 'Diálogos')],
    { inicio: new Date('2026-08-01'), final: new Date('2026-11-30') } as Intervalo,
    3800,
    [
        new Avaliacao(4.0, 'Roteiro coerente com boas reviravoltas.', new Date('2026-03-05'), Papel.ROTEITISTA, projetoAnterior01),
        new Avaliacao(3.7, 'Precisou de algumas revisões extras.', new Date('2026-04-20'), Papel.ROTEITISTA, projetoAnterior04),
    ]
)
 
// ---------------- PROFISSIONAL 12 ----------------
const profissional12 = new Profissional(
    'prof-012',
    'Lucas Carvalho',
    [new Competencias(4, 'Composição VFX'), new Competencias(3, 'Animação 3D')],
    { inicio: new Date('2026-11-15'), final: new Date('2027-05-15') } as Intervalo,
    6200,
    [
        new Avaliacao(4.1, 'Bom trabalho em cenas de explosão e destruição.', new Date('2026-08-25'), Papel.EFEITOS_VISUAIS, projetoAnterior02),
        new Avaliacao(3.9, 'Ainda pode melhorar o tempo de renderização.', new Date('2026-09-28'), Papel.EFEITOS_VISUAIS, projetoAnterior05),
    ]
)
 
// ---------------- PROFISSIONAL 13 ----------------
const profissional13 = new Profissional(
    'prof-013',
    'Mariana Duarte',
    [new Competencias(5, 'Direção de Atores'), new Competencias(5, 'Visão Criativa')],
    { inicio: new Date('2026-09-25'), final: new Date('2027-02-25') } as Intervalo,
    6500,
    [
        new Avaliacao(5.0, 'A melhor diretora com quem já trabalhamos.', new Date('2026-05-01'), Papel.DIRETOR, projetoAnterior03),
        new Avaliacao(4.8, 'Visão criativa impecável do início ao fim.', new Date('2026-07-01'), Papel.DIRETOR, projetoAnterior01),
    ]
)
 
// ---------------- PROFISSIONAL 14 ----------------
const profissional14 = new Profissional(
    'prof-014',
    'Nicolas Barros',
    [new Competencias(3, 'Iluminação'), new Competencias(3, 'Enquadramento')],
    { inicio: new Date('2026-10-10'), final: new Date('2027-03-10') } as Intervalo,
    3900,
    [
        new Avaliacao(3.5, 'Trabalho satisfatório, ainda em início de carreira.', new Date('2026-05-08'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior04),
        new Avaliacao(3.6, 'Demonstrou boa vontade de aprender.', new Date('2026-06-25'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior02),
    ]
)
 
// ---------------- PROFISSIONAL 15 ----------------
const profissional15 = new Profissional(
    'prof-015',
    'Olivia Pereira',
    [new Competencias(5, 'Captação de Áudio'), new Competencias(5, 'Mixagem')],
    { inicio: new Date('2026-09-05'), final: new Date('2027-01-05') } as Intervalo,
    3600,
    [
        new Avaliacao(4.9, 'Referência em qualidade de áudio na equipe.', new Date('2026-04-15'), Papel.SONOPLASTA, projetoAnterior05),
        new Avaliacao(4.7, 'Sempre disponível para ajustes de última hora.', new Date('2026-06-10'), Papel.SONOPLASTA, projetoAnterior03),
    ]
)
 
// ---------------- PROFISSIONAL 16 ----------------
const profissional16 = new Profissional(
    'prof-016',
    'Pedro Henrique Alves',
    [new Competencias(4, 'Montagem'), new Competencias(4, 'Color Grading')],
    { inicio: new Date('2026-11-20'), final: new Date('2027-04-20') } as Intervalo,
    4900,
    [
        new Avaliacao(4.2, 'Boa consistência visual entre as cenas.', new Date('2026-08-15'), Papel.EDITOR, projetoAnterior01),
        new Avaliacao(4.0, 'Comunicação eficiente com o diretor.', new Date('2026-09-18'), Papel.EDITOR, projetoAnterior05),
    ]
)
 
// ---------------- PROFISSIONAL 17 ----------------
const profissional17 = new Profissional(
    'prof-017',
    'Quésia Nogueira',
    [new Competencias(3, 'Estrutura Narrativa'), new Competencias(4, 'Diálogos')],
    { inicio: new Date('2026-08-10'), final: new Date('2026-12-10') } as Intervalo,
    3700,
    [
        new Avaliacao(3.8, 'Bons diálogos, roteiro precisou de ajustes de ritmo.', new Date('2026-03-15'), Papel.ROTEITISTA, projetoAnterior02),
        new Avaliacao(3.9, 'Flexível a mudanças pedidas pela produção.', new Date('2026-04-30'), Papel.ROTEITISTA, projetoAnterior01),
    ]
)
 
// ---------------- PROFISSIONAL 18 ----------------
const profissional18 = new Profissional(
    'prof-018',
    'Rafael Teixeira',
    [new Competencias(5, 'Composição VFX'), new Competencias(5, 'Animação 3D')],
    { inicio: new Date('2026-11-25'), final: new Date('2027-05-25') } as Intervalo,
    7500,
    [
        new Avaliacao(4.8, 'Efeitos visuais de nível cinematográfico.', new Date('2026-08-30'), Papel.EFEITOS_VISUAIS, projetoAnterior03),
        new Avaliacao(4.6, 'Entregas sempre dentro do prazo, mesmo em cenas complexas.', new Date('2026-10-02'), Papel.EFEITOS_VISUAIS, projetoAnterior02),
    ]
)
 
// ---------------- PROFISSIONAL 19 ----------------
const profissional19 = new Profissional(
    'prof-019',
    'Sofia Cardoso',
    [new Competencias(4, 'Direção de Atores'), new Competencias(4, 'Visão Criativa')],
    { inicio: new Date('2026-10-15'), final: new Date('2027-03-15') } as Intervalo,
    5800,
    [
        new Avaliacao(4.3, 'Boa condução do elenco em cenas de tensão.', new Date('2026-05-20'), Papel.DIRETOR, projetoAnterior04),
        new Avaliacao(4.1, 'Organizada e pontual em todas as gravações.', new Date('2026-07-08'), Papel.DIRETOR, projetoAnterior03),
    ]
)
 
// ---------------- PROFISSIONAL 20 ----------------
const profissional20 = new Profissional(
    'prof-020',
    'Thiago Batista',
    [new Competencias(3, 'Iluminação'), new Competencias(4, 'Enquadramento')],
    { inicio: new Date('2026-10-25'), final: new Date('2027-03-25') } as Intervalo,
    4100,
    [
        new Avaliacao(3.9, 'Bom enquadramento, especialmente em planos externos.', new Date('2026-05-25'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior05),
        new Avaliacao(4.0, 'Trabalho consistente ao longo de todo o projeto.', new Date('2026-07-20'), Papel.DIRETOR_FOTOGRAFIA, projetoAnterior04),
    ]
)
 


export const profissionais: Profissional[] = [
    profissional01, profissional02, profissional03, profissional04, profissional05,
    profissional06, profissional07, profissional08, profissional09, profissional10,
    profissional11, profissional12, profissional13, profissional14, profissional15,
    profissional16, profissional17, profissional18, profissional19, profissional20,
];


export const projeto = new Projeto(
           'proj-001',
           Genero.ACAO,
           120,
           1500000,
           new Date('2027-03-15'),
           TipoProjeto.FICCAO,
           new Map<Papel, Array<Competencias>>([
               [Papel.DIRETOR, [new Competencias(5, 'Direção de Atores'), new Competencias(4, 'Visão Criativa')]],
               [Papel.DIRETOR_FOTOGRAFIA, [new Competencias(5, 'Iluminação'), new Competencias(4, 'Composição de Quadro')]],
           ]),
           undefined, 
           
       )
       ;

