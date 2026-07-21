BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [idx_template_id] ON [dbo].[notification];
DROP INDEX [idx_user_id] ON [dbo].[notification];
ALTER TABLE [dbo].[notification] DROP CONSTRAINT [notification_id_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'notification'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_notification] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [template_id] INT NOT NULL,
    [template_name] NVARCHAR(max),
    [subject] NVARCHAR(max),
    CONSTRAINT [notification_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [notification_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_notification] ON;
IF EXISTS(SELECT * FROM [dbo].[notification])
    EXEC('INSERT INTO [dbo].[_prisma_new_notification] ([id],[subject],[template_id],[template_name],[user_id]) SELECT [id],[subject],[template_id],[template_name],[user_id] FROM [dbo].[notification] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_notification] OFF;
DROP TABLE [dbo].[notification];
EXEC SP_RENAME N'dbo._prisma_new_notification', N'notification';
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[notification]([user_id]);
CREATE NONCLUSTERED INDEX [idx_template_id] ON [dbo].[notification]([template_id]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[application_log] ADD CONSTRAINT [application_log_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
