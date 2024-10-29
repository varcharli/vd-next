// Director Entity
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Director {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    photoUrl: string;
}