import { Repository } from "typeorm";
import { Profissional } from "../Entidades/Profissionais";
import { AppDataSource } from "../ConecBanco";

export default class ProfissionaisRepositorio extends Repository<Profissional>{
    constructor(){
        super(Profissional,AppDataSource.createEntityManager())
    }
}