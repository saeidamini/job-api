
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { Skill } from './skill.entity';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  externalJobId: string;

  @Column()
  title: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: false })
  remote: boolean;

  @Column({ nullable: true })
  type: string;

  @Column('decimal', { nullable: true, precision: 10, scale: 2 })
  salaryMin: number;

  @Column('decimal', { nullable: true, precision: 10, scale: 2 })
  salaryMax: number;

  @Column({ default: 'USD' })
  currency: string;

  @ManyToOne(() => Company, company => company.jobOffers)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;

  @Column({ nullable: true })
  experience: number;

  @Column({ type: 'date' })
  postedDate: Date;

  @Column()
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Skill, skill => skill.jobOffers)
  @JoinTable({
    name: 'job_offer_skills',
    joinColumn: { name: 'jobOfferId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' }
  })
  skills: Skill[];
}