/*
  Warnings:

  - Added the required column `created_by` to the `role_permission` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [idx_permission_id] ON [dbo].[role_permission];
DROP INDEX [idx_role_id] ON [dbo].[role_permission];
DROP INDEX [idx_user_id] ON [dbo].[role_permission];
ALTER TABLE [dbo].[role_permission] DROP CONSTRAINT [role_permission_id_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'role_permission'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_role_permission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role_id] INT NOT NULL,
    [permission_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [role_permission_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [role_permission_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [role_permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_permission_id_key] UNIQUE NONCLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_role_permission] ON;
IF EXISTS(SELECT * FROM [dbo].[role_permission])
    EXEC('INSERT INTO [dbo].[_prisma_new_role_permission] ([id],[permission_id],[role_id],[user_id]) SELECT [id],[permission_id],[role_id],[user_id] FROM [dbo].[role_permission] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_role_permission] OFF;
DROP TABLE [dbo].[role_permission];
EXEC SP_RENAME N'dbo._prisma_new_role_permission', N'role_permission';
CREATE NONCLUSTERED INDEX [idx_role_id] ON [dbo].[role_permission]([role_id]);
CREATE NONCLUSTERED INDEX [idx_permission_id] ON [dbo].[role_permission]([permission_id]);
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[role_permission]([user_id]);
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
