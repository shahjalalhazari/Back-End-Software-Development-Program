import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class CreateUserTable1720000000000 implements MigrationInterface {
  name = 'CreateUserTable1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('SYSTEM_ADMIN', 'CUSTOMER', 'VENDOR'),
    `);

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            isUnique: true,
          }),
          new TableColumn({
            name: 'password',
            type: 'varchar',
          }),
          new TableColumn({
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'role',
            type: 'enum',
            enum: ['SYSTEM_ADMIN', 'CUSTOMER', 'VENDOR'],
            default: `'CUSTOMER'`,
          }),
          new TableColumn({
            name: 'isActive',
            type: 'boolean',
            default: true,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_user_email',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'IDX_user_email');
    await queryRunner.dropTable('user');
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}
