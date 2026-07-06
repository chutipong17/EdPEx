/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[refresh_token] ADD CONSTRAINT [refresh_token_user_id_key] UNIQUE NONCLUSTERED ([user_id]);

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
