BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[kpi] DROP CONSTRAINT [kpi_frequency_id_fkey];

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[frequency] DROP CONSTRAINT [frequency_id_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'frequency'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_frequency] (
    [id] INT NOT NULL,
    [frequency_name] NVARCHAR(255) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [frequency_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [frequency_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [frequency_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [frequency_id_key] UNIQUE NONCLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[frequency])
    EXEC('INSERT INTO [dbo].[_prisma_new_frequency] ([created_at],[created_by],[frequency_name],[id],[is_deleted],[updated_at],[updated_by]) SELECT [created_at],[created_by],[frequency_name],[id],[is_deleted],[updated_at],[updated_by] FROM [dbo].[frequency] WITH (holdlock tablockx)');
DROP TABLE [dbo].[frequency];
EXEC SP_RENAME N'dbo._prisma_new_frequency', N'frequency';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[kpi] ADD CONSTRAINT [kpi_frequency_id_fkey] FOREIGN KEY ([frequency_id]) REFERENCES [dbo].[frequency]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
