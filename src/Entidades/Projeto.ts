import { Entity,PrimaryGeneratedColumn,Column} from "typeorm";



@Entity()
export class Projetos{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    genero:string

    @Column({nullable:false})
    duracaoMin:number

    @Column({nullable:false})
    orcamento:number

    @Column({nullable:false})
    prazo:Date

    

}