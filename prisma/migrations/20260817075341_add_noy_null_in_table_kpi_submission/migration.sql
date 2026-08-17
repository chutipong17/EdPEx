BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[kpi_submission] ALTER COLUMN [submitted_by] NVARCHAR(100) NULL;
ALTER TABLE [dbo].[kpi_submission] ALTER COLUMN [submitted_date] DATETIME2 NULL;
ALTER TABLE [dbo].[kpi_submission] ALTER COLUMN [actual_value] DECIMAL(5,2) NULL;
ALTER TABLE [dbo].[kpi_submission] ALTER COLUMN [calculated_score] DECIMAL(5,2) NULL;
ALTER TABLE [dbo].[kpi_submission] ALTER COLUMN [achievement_percent] DECIMAL(5,2) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
