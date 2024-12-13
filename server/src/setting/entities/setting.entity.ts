import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';


@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    // @Index()
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: true })
    value: string;
}