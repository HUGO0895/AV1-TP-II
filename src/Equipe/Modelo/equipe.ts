import MembroEquipe from "./membroEquipe"
export default class Equipe{
    public dataFormacao:Date
    public status:string
    public  membrosEquipe:Array<MembroEquipe>
    constructor(dataFormacao:Date,status:string,membrosEquipe:Array<MembroEquipe>){
        this.dataFormacao=dataFormacao
        this.status=status
        this.membrosEquipe=membrosEquipe
    }
}