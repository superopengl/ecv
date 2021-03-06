import { Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, OneToOne, IsNull, Not, DeleteDateColumn, CreateDateColumn, JoinTable, ManyToMany } from 'typeorm';
import { Role } from '../types/Role';
import { UserStatus } from '../types/UserStatus';
import { UserProfile } from './UserProfile';
import { UserTag } from './UserTag';

@Entity()
@Index('user_email_hash_unique', { synchronize: false })
export class User {
  static scope = {
    'default': {
      deletedAt: IsNull()
    },
    'all': {
      deletedAt: Not(IsNull())
    }
  };

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  // @Index('user_email_unique', { unique: true })
  /**
   * The unique index of user_email_unique will be created by migration script,
   * as TypeOrm doesn't support case insensitive index.
   */
  @Column()
  emailHash!: string;

  @Column({ default: 'local' })
  loginType: string;

  @Column()
  secret!: string;

  @Column({ type: 'uuid' })
  salt!: string;

  @Column({ nullable: false })
  @Index()
  role!: Role;

  @Column({ nullable: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true })
  lastNudgedAt?: Date;

  @Column({ default: UserStatus.Enabled })
  status!: UserStatus;

  @Index('user_resetPasswordToken_unique', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  resetPasswordToken?: string;

  @DeleteDateColumn()
  @Index()
  deletedAt: Date;

  @OneToOne(() => UserProfile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profileId', referencedColumnName: 'id' })
  profile: UserProfile;

  @Column({ nullable: true })
  profileId: string;

  @ManyToMany(type => UserTag, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: UserTag[];

  @Column({ type: 'uuid', nullable: true })
  @Index({ where: '"everPaid" = TRUE' })
  referredBy: string;

  @Column({ default: false })
  everPaid: boolean;
}
