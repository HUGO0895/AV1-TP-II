import { Repository } from "typeorm"
import { Projetos } from "../Entidades/Projeto"
import { AppDataSource } from "../ConecBanco"

export default class ProjetoRepositorio extends Repository<Projetos>{
         constructor(){
            super(Projetos,AppDataSource.createEntityManager())
         }
}