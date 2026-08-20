import MembroEquipe from "./membroEquipe"
export default class Equipe{
    private id:string
    public dataFormacao:Date
    public status:string
    public  membrosEquipe:Array<MembroEquipe>
    constructor(id:string,dataFormacao:Date,status:string,membrosEquipe:Array<MembroEquipe>){
        this.id=id
        this.dataFormacao=dataFormacao
        this.status=status
        this.membrosEquipe=membrosEquipe
    }
}