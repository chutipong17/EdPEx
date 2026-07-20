BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[department] DROP CONSTRAINT [department_organization_id_fkey];

-- AlterTable
ALTER TABLE [dbo].[department] ALTER COLUMN [department_code] VARCHAR(100) NULL;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[organization] DROP CONSTRAINT [organization_id_key];
ALTER TABLE [dbo].[organization] DROP CONSTRAINT [organization_organization_code_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'organization'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_organization] (
    [id] INT NOT NULL,
    [organization_code] VARCHAR(100) NOT NULL,
    [organization_name] NVARCHAR(255) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [organization_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [organization_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [organization_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [organization_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [organization_organization_code_key] UNIQUE NONCLUSTERED ([organization_code])
);
IF EXISTS(SELECT * FROM [dbo].[organization])
    EXEC('INSERT INTO [dbo].[_prisma_new_organization] ([created_at],[created_by],[id],[is_deleted],[organization_code],[organization_name],[updated_at],[updated_by]) SELECT [created_at],[created_by],[id],[is_deleted],[organization_code],[organization_name],[updated_at],[updated_by] FROM [dbo].[organization] WITH (holdlock tablockx)');
DROP TABLE [dbo].[organization];
EXEC SP_RENAME N'dbo._prisma_new_organization', N'organization';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[department] ADD CONSTRAINT [department_organization_id_fkey] FOREIGN KEY ([organization_id]) REFERENCES [dbo].[organization]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
