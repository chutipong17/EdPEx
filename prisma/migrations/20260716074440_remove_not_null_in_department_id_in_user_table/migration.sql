BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[user] DROP CONSTRAINT [user_department_id_fkey];

-- AlterTable
ALTER TABLE [dbo].[user] ALTER COLUMN [department_id] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_department_id_fkey] FOREIGN KEY ([department_id]) REFERENCES [dbo].[department]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
