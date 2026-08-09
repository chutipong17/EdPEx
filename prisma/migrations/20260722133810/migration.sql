BEGIN TRY

BEGIN TRAN;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_submission] ADD CONSTRAINT [kpi_submission_status_id_fkey] FOREIGN KEY ([status_id]) REFERENCES [dbo].[kpi_submission_status]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_submission] ADD CONSTRAINT [kpi_submission_kpi_assignment_id_fkey] FOREIGN KEY ([kpi_assignment_id]) REFERENCES [dbo].[kpi_assignment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
