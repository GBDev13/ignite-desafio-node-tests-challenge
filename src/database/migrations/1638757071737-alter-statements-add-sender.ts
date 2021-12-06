import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class alterStatementsAddSender1638757071737
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "sender_id",
        type: "uuid",
      })
    );

    await queryRunner.createForeignKey(
      "statements",
      new TableForeignKey({
        name: "FKSenderId",
        columnNames: ["sender_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("statements", "FKSenderId");
    await queryRunner.dropColumn("statements", "sender_id");
  }
}
