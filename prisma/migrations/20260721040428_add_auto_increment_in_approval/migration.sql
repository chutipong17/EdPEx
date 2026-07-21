BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[approval] DROP CONSTRAINT [approval_id_key];
DROP INDEX [idx_approval_status_id] ON [dbo].[approval];
DROP INDEX [idx_approver_id] ON [dbo].[approval];
DROP INDEX [idx_kpi_submission_id] ON [dbo].[approval];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'approval'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_approval] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_submission_id] INT NOT NULL,
    [approver_id] INT NOT NULL,
    [approval_status_id] INT NOT NULL,
    [approved_date] DATETIME2 NOT NULL,
    [remark] NVARCHAR(max),
    [is_deleted] BIT NOT NULL CONSTRAINT [approval_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [approval_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [approval_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [approval_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_approval] ON;
IF EXISTS(SELECT * FROM [dbo].[approval])
    EXEC('INSERT INTO [dbo].[_prisma_new_approval] ([approval_status_id],[approved_date],[approver_id],[created_at],[created_by],[id],[is_deleted],[kpi_submission_id],[remark],[updated_at],[updated_by]) SELECT [approval_status_id],[approved_date],[approver_id],[created_at],[created_by],[id],[is_deleted],[kpi_submission_id],[remark],[updated_at],[updated_by] FROM [dbo].[approval] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_approval] OFF;
DROP TABLE [dbo].[approval];
EXEC SP_RENAME N'dbo._prisma_new_approval', N'approval';
CREATE NONCLUSTERED INDEX [idx_kpi_submission_id] ON [dbo].[approval]([kpi_submission_id]);
CREATE NONCLUSTERED INDEX [idx_approver_id] ON [dbo].[approval]([approver_id]);
CREATE NONCLUSTERED INDEX [idx_approval_status_id] ON [dbo].[approval]([approval_status_id]);
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
