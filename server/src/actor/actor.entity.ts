import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// Actor Entity
@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    photoUrl: string;
}