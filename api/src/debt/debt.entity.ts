import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

const numericToNumberTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null): number | null => (value === null ? null : Number(value))
};

@Entity({ name: 'debt' })
@Unique(['email', 'debtSubject'])
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  debtSubject!: string;

  @Column('numeric', { precision: 12, scale: 2, transformer: numericToNumberTransformer })
  debtAmount!: number;

  @Column({ type: 'enum', enum: DebtStatus, default: DebtStatus.PENDING })
  status!: DebtStatus;

  @Column({ type: 'text', nullable: true })
  stripePaymentIntentId!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
