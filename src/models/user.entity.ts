import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true,nullable: false})
    name: string;

    @Column({nullable: false})
    passwordHashed: string;

    @Column({default: false})
    isAdmin: boolean;
}