import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeRemove, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    static create(user: User): any {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateOfBirth: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedDate: Date;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        console.log('hash')
        if (this.password) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedDate = new Date();
    }

    @BeforeRemove()
    softDelete() {
        this.deletedDate = new Date();
    }
}
