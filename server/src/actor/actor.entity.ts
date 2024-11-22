import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
// Actor Entity
@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    photoUrl: string;
}