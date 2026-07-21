BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[approval] DROP CONSTRAINT [approval_kpi_submission_id_fkey];

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [idx_kpi_assignment_id] ON [dbo].[kpi_submission];
DROP INDEX [idx_status_id] ON [dbo].[kpi_submission];
ALTER TABLE [dbo].[kpi_submission] DROP CONSTRAINT [kpi_submission_id_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'kpi_submission'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_kpi_submission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_assignment_id] INT NOT NULL,
    [status_id] INT,
    [submitted_by] NVARCHAR(100) NOT NULL,
    [submitted_date] DATETIME2 NOT NULL,
    [description] NVARCHAR(max),
    [actual_value] DECIMAL(5,2) NOT NULL,
    [calculated_score] DECIMAL(5,2) NOT NULL,
    [achievement_percent] DECIMAL(5,2) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_submission_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_submission_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_submission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_submission_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_kpi_submission] ON;
IF EXISTS(SELECT * FROM [dbo].[kpi_submission])
    EXEC('INSERT INTO [dbo].[_prisma_new_kpi_submission] ([achievement_percent],[actual_value],[calculated_score],[created_at],[created_by],[description],[id],[is_deleted],[kpi_assignment_id],[status_id],[submitted_by],[submitted_date],[updated_at],[updated_by]) SELECT [achievement_percent],[actual_value],[calculated_score],[created_at],[created_by],[description],[id],[is_deleted],[kpi_assignment_id],[status_id],[submitted_by],[submitted_date],[updated_at],[updated_by] FROM [dbo].[kpi_submission] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_kpi_submission] OFF;
DROP TABLE [dbo].[kpi_submission];
EXEC SP_RENAME N'dbo._prisma_new_kpi_submission', N'kpi_submission';
CREATE NONCLUSTERED INDEX [idx_kpi_assignment_id] ON [dbo].[kpi_submission]([kpi_assignment_id]);
CREATE NONCLUSTERED INDEX [idx_status_id] ON [dbo].[kpi_submission]([status_id]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[attachment] ADD CONSTRAINT [attachment_kpi_submission_id_fkey] FOREIGN KEY ([kpi_submission_id]) REFERENCES [dbo].[kpi_submission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_kpi_submission_id_fkey] FOREIGN KEY ([kpi_submission_id]) REFERENCES [dbo].[kpi_submission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
