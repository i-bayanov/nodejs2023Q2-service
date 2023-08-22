import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  version: number;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;

    return {
      id,
      login,
      version,
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
    };
  }
}
