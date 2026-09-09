import { Repository } from "typeorm";
import { Competencias } from "../Entidades/Competencias";
import { AppDataSource } from "../ConecBanco";

export default class CompetenciaRepositorio extends Repository<Competencias>{
    constructor(){
        super(Competencias,AppDataSource.createEntityManager())
    }
}