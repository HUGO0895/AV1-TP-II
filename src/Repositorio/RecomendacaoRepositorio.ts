import { Repository } from "typeorm";
import { Recomendacao } from "../Entidades/Recomendacao";
import { AppDataSource } from "../ConecBanco";

export default class RecomendacaoRepositorio extends Repository<Recomendacao>{
    constructor(){
        super(Recomendacao,AppDataSource.createEntityManager())
    }
} 