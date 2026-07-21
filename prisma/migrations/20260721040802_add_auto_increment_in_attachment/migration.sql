BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[attachment] DROP CONSTRAINT [attachment_id_key];
DROP INDEX [idx_kpi_submission_id] ON [dbo].[attachment];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'attachment'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_attachment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_submission_id] INT NOT NULL,
    [file_name] NVARCHAR(200) NOT NULL,
    [file_path] NVARCHAR(1000) NOT NULL,
    [mime_type] VARCHAR(100) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [attachment_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [attachment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [attachment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [attachment_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_attachment] ON;
IF EXISTS(SELECT * FROM [dbo].[attachment])
    EXEC('INSERT INTO [dbo].[_prisma_new_attachment] ([created_at],[created_by],[file_name],[file_path],[id],[is_deleted],[kpi_submission_id],[mime_type],[updated_at],[updated_by]) SELECT [created_at],[created_by],[file_name],[file_path],[id],[is_deleted],[kpi_submission_id],[mime_type],[updated_at],[updated_by] FROM [dbo].[attachment] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_attachment] OFF;
DROP TABLE [dbo].[attachment];
EXEC SP_RENAME N'dbo._prisma_new_attachment', N'attachment';
CREATE NONCLUSTERED INDEX [idx_kpi_submission_id] ON [dbo].[attachment]([kpi_submission_id]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[notification] ADD CONSTRAINT [notification_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[notification] ADD CONSTRAINT [notification_template_id_fkey] FOREIGN KEY ([template_id]) REFERENCES [dbo].[notification_template]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
