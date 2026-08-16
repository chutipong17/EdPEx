/*
  Warnings:

  - You are about to drop the column `token` on the `kpi_assignment` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[kpi_assignment] ALTER COLUMN [due_date] DATETIME2 NULL;
ALTER TABLE [dbo].[kpi_assignment] DROP COLUMN [token];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
