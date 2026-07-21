BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[application_log] DROP CONSTRAINT [application_log_id_key];
DROP INDEX [idx_user_id] ON [dbo].[application_log];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'application_log'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_application_log] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [module_name] VARCHAR(255) NOT NULL,
    [action_type] VARCHAR(255) NOT NULL,
    [template_name] NVARCHAR(max),
    [subject] NVARCHAR(max),
    [is_deleted] BIT NOT NULL CONSTRAINT [application_log_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [application_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [application_log_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [application_log_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_application_log] ON;
IF EXISTS(SELECT * FROM [dbo].[application_log])
    EXEC('INSERT INTO [dbo].[_prisma_new_application_log] ([action_type],[created_at],[created_by],[id],[is_deleted],[module_name],[subject],[template_name],[updated_at],[updated_by],[user_id]) SELECT [action_type],[created_at],[created_by],[id],[is_deleted],[module_name],[subject],[template_name],[updated_at],[updated_by],[user_id] FROM [dbo].[application_log] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_application_log] OFF;
DROP TABLE [dbo].[application_log];
EXEC SP_RENAME N'dbo._prisma_new_application_log', N'application_log';
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[application_log]([user_id]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_kpi_submission_id_fkey] FOREIGN KEY ([kpi_submission_id]) REFERENCES [dbo].[kpi_submission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_approver_id_fkey] FOREIGN KEY ([approver_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_approval_status_id_fkey] FOREIGN KEY ([approval_status_id]) REFERENCES [dbo].[approval_status]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
