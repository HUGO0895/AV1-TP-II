import { Papel } from "../Equipe/Enum/papel";
import Competencias from "../Equipe/Modelo/Competencias";
import Profissional from "../Equipe/Modelo/Profissional";
import { Genero } from "../Projetos/Enum/TipoGenero";
import { TipoProjeto } from "../Projetos/Enum/TipoProjeto";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "./RecomendacaoStrategy";

export default class SimiliaridadeCosseno implements RecomendacaoStrategy{
    recomendar(projeto: Projeto, profissionais: Array<Profissional>): Map<Papel, Profissional> {
                const mapaEquipe=new Map<Papel,Profissional>
                 for(let x of Object.keys(projeto.competencias)){
                    if(mapaEquipe.size){
                      for(let chave of mapaEquipe.keys()){
                      profissionais=profissionais.filter((profissional)=>JSON.stringify(mapaEquipe.get(chave))!==JSON.stringify(profissional))
                      }
                    }
                    const profissional=this.melhorEscolhaParaCadaPapel(profissionais,projeto.competencias[x])
                    mapaEquipe.set(x as Papel,profissional)
                 }
                 return mapaEquipe
       
    }
    melhorEscolhaParaCadaPapel(profissionais:Array<Profissional>,competencias:Array<Competencias>){
         const competenciasNecessarias=competencias.map((valor)=>{valor.nome.toLocaleLowerCase(); return valor;})
         console.log(competenciasNecessarias)
         const VetorParaGuardarProfissionaisComSuasNotas=[]
         profissionais.forEach((profissional)=>{
           const competenciasdoProfissional= profissional.competencias.map((valor)=>{valor.nome.toLocaleLowerCase(); return valor;})
        
           const resultadoPares=competenciasNecessarias.map((valor)=> {
           const verdade= competenciasdoProfissional.find((v2)=>v2.nome==valor.nome); return verdade!=undefined ? verdade.nivel*valor.nivel:0;  } ).reduce((acu,valor)=>valor+acu,0)

           const ResultadoTamanhoPapel=Math.sqrt(competenciasNecessarias.reduce((acu,valor)=>acu+valor.nivel*valor.nivel,0))
           const ResultadoTamanhoProfi=Math.sqrt(competenciasdoProfissional.reduce((acu,valor)=>acu+valor.nivel*valor.nivel,0))
           const denominador = ResultadoTamanhoPapel * ResultadoTamanhoProfi
           const similariadadeCosseno = denominador === 0 ? 0 : resultadoPares / denominador
            
           VetorParaGuardarProfissionaisComSuasNotas.push([profissional,similariadadeCosseno])

         })

         const vetorParaAcharMelhorCosseno:Array<number>=VetorParaGuardarProfissionaisComSuasNotas.map((profN:[Projeto,number])=>profN[1])
         const alvo=Math.max(...vetorParaAcharMelhorCosseno)
        
         return  VetorParaGuardarProfissionaisComSuasNotas.find((profN:[Projeto,number])=> profN[1]==alvo)[0]
    }
     
}

