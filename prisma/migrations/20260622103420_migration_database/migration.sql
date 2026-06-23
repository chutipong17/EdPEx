BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[month_of_delivery] (
    [id] INT NOT NULL,
    [name] NVARCHAR(20) NOT NULL,
    [value] CHAR(2) NOT NULL,
    CONSTRAINT [month_of_delivery_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [month_of_delivery_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[permission] (
    [id] INT NOT NULL,
    [permission_code] VARCHAR(200) NOT NULL,
    [permission_name] VARCHAR(200) NOT NULL,
    CONSTRAINT [permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [permission_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [permission_permission_code_key] UNIQUE NONCLUSTERED ([permission_code])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] INT NOT NULL,
    [role_code] VARCHAR(100) NOT NULL,
    [role_name_en] VARCHAR(100) NOT NULL,
    [role_name_th] NVARCHAR(150) NOT NULL,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [role_role_code_key] UNIQUE NONCLUSTERED ([role_code])
);

-- CreateTable
CREATE TABLE [dbo].[role_permission] (
    [id] INT NOT NULL,
    [role_id] INT NOT NULL,
    [permission_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    CONSTRAINT [role_permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_permission_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[target_condition] (
    [id] INT NOT NULL,
    [condition_name] VARCHAR(5) NOT NULL,
    [description] VARCHAR(30) NOT NULL,
    CONSTRAINT [target_condition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [target_condition_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[organization] (
    [id] INT NOT NULL IDENTITY(1,1),
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

-- CreateTable
CREATE TABLE [dbo].[department] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organization_id] INT NOT NULL,
    [department_code] VARCHAR(100) NOT NULL,
    [department_name] NVARCHAR(255) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [department_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [department_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [department_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [department_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [department_department_code_key] UNIQUE NONCLUSTERED ([department_code])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [category_name] NVARCHAR(255) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_category_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_category_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_category_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_category_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[frequency] (
    [id] INT NOT NULL IDENTITY(1,1),
    [frequency_name] NVARCHAR(255) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [frequency_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [frequency_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [frequency_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [frequency_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_category_id] INT NOT NULL,
    [month_of_delivery_id] INT NOT NULL,
    [frequency_id] INT NOT NULL,
    [target_condition_id] INT NOT NULL,
    [kpi_code] VARCHAR(255) NOT NULL,
    [kpi_name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(max),
    [unit] VARCHAR(100) NOT NULL,
    [year] INT NOT NULL,
    [target_value] DECIMAL(5,2) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [kpi_is_active_df] DEFAULT 0,
    [remark] NVARCHAR(max),
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_comparison] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_id] INT NOT NULL,
    [seq] INT NOT NULL,
    [name] NVARCHAR(255),
    [result] NVARCHAR(255),
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_comparison_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_comparison_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_comparison_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_comparison_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_target] (
    [id] INT NOT NULL IDENTITY(1,1),
    [kpi_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [department_id] INT NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_target_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_target_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_target_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_target_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [department_id] INT NOT NULL,
    [first_name] NVARCHAR(255) NOT NULL,
    [last_name] NVARCHAR(255) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [mobile_number] VARCHAR(20) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [user_is_active_df] DEFAULT 0,
    [is_deleted] BIT NOT NULL CONSTRAINT [user_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[auth] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [username] VARCHAR(255) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [auth_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [auth_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [auth_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [auth_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [auth_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[refresh_token] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expiry_date] DATETIME2 NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [refresh_token_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [refresh_token_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [refresh_token_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [refresh_token_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_assignment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [kpi_id] INT NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [assigned_date] DATETIME2 NOT NULL,
    [due_date] DATETIME2 NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [kpi_assignment_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [kpi_assignment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    [created_by] NVARCHAR(255) NOT NULL,
    [updated_by] NVARCHAR(255),
    CONSTRAINT [kpi_assignment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_assignment_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_submission_status] (
    [id] INT NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(255) NOT NULL,
    CONSTRAINT [kpi_submission_status_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [kpi_submission_status_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[kpi_submission] (
    [id] INT NOT NULL,
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

-- CreateTable
CREATE TABLE [dbo].[attachment] (
    [id] INT NOT NULL,
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

-- CreateTable
CREATE TABLE [dbo].[approval] (
    [id] INT NOT NULL,
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

-- CreateTable
CREATE TABLE [dbo].[approval_status] (
    [id] INT NOT NULL,
    [status_name] NVARCHAR(200) NOT NULL,
    [value] VARCHAR(200) NOT NULL,
    CONSTRAINT [approval_status_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [approval_status_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notification_template] (
    [id] INT NOT NULL,
    [template_name] NVARCHAR(max) NOT NULL,
    [subject] NVARCHAR(max) NOT NULL,
    [body] NVARCHAR(max) NOT NULL,
    CONSTRAINT [notification_template_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [notification_template_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notification] (
    [id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [template_id] INT NOT NULL,
    [template_name] NVARCHAR(max),
    [subject] NVARCHAR(max),
    CONSTRAINT [notification_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [notification_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[application_log] (
    [id] INT NOT NULL,
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

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_role_id] ON [dbo].[role_permission]([role_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_permission_id] ON [dbo].[role_permission]([permission_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[role_permission]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_organization_id] ON [dbo].[department]([organization_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_category_id] ON [dbo].[kpi]([kpi_category_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_month_of_delivery_id] ON [dbo].[kpi]([month_of_delivery_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_frequency_id] ON [dbo].[kpi]([frequency_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_target_condition_id] ON [dbo].[kpi]([target_condition_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_id] ON [dbo].[kpi_comparison]([kpi_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_id] ON [dbo].[kpi_target]([kpi_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[kpi_target]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_department_id] ON [dbo].[kpi_target]([department_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_department_id] ON [dbo].[user]([department_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[auth]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[refresh_token]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[kpi_assignment]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_id] ON [dbo].[kpi_assignment]([kpi_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_assignment_id] ON [dbo].[kpi_submission]([kpi_assignment_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_status_id] ON [dbo].[kpi_submission]([status_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_submission_id] ON [dbo].[attachment]([kpi_submission_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_kpi_submission_id] ON [dbo].[approval]([kpi_submission_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_approver_id] ON [dbo].[approval]([approver_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_approval_status_id] ON [dbo].[approval]([approval_status_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[notification]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_template_id] ON [dbo].[notification]([template_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idx_user_id] ON [dbo].[application_log]([user_id]);

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[department] ADD CONSTRAINT [department_organization_id_fkey] FOREIGN KEY ([organization_id]) REFERENCES [dbo].[organization]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi] ADD CONSTRAINT [kpi_kpi_category_id_fkey] FOREIGN KEY ([kpi_category_id]) REFERENCES [dbo].[kpi_category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi] ADD CONSTRAINT [kpi_frequency_id_fkey] FOREIGN KEY ([frequency_id]) REFERENCES [dbo].[frequency]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi] ADD CONSTRAINT [kpi_month_of_delivery_id_fkey] FOREIGN KEY ([month_of_delivery_id]) REFERENCES [dbo].[month_of_delivery]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi] ADD CONSTRAINT [kpi_target_condition_id_fkey] FOREIGN KEY ([target_condition_id]) REFERENCES [dbo].[target_condition]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_comparison] ADD CONSTRAINT [kpi_comparison_kpi_id_fkey] FOREIGN KEY ([kpi_id]) REFERENCES [dbo].[kpi]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_target] ADD CONSTRAINT [kpi_target_kpi_id_fkey] FOREIGN KEY ([kpi_id]) REFERENCES [dbo].[kpi]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_target] ADD CONSTRAINT [kpi_target_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_target] ADD CONSTRAINT [kpi_target_department_id_fkey] FOREIGN KEY ([department_id]) REFERENCES [dbo].[department]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_department_id_fkey] FOREIGN KEY ([department_id]) REFERENCES [dbo].[department]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[auth] ADD CONSTRAINT [auth_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[refresh_token] ADD CONSTRAINT [refresh_token_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_assignment] ADD CONSTRAINT [kpi_assignment_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_assignment] ADD CONSTRAINT [kpi_assignment_kpi_id_fkey] FOREIGN KEY ([kpi_id]) REFERENCES [dbo].[kpi]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_submission] ADD CONSTRAINT [kpi_submission_status_id_fkey] FOREIGN KEY ([status_id]) REFERENCES [dbo].[kpi_submission_status]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[kpi_submission] ADD CONSTRAINT [kpi_submission_kpi_assignment_id_fkey] FOREIGN KEY ([kpi_assignment_id]) REFERENCES [dbo].[kpi_assignment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[attachment] ADD CONSTRAINT [attachment_kpi_submission_id_fkey] FOREIGN KEY ([kpi_submission_id]) REFERENCES [dbo].[kpi_submission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_kpi_submission_id_fkey] FOREIGN KEY ([kpi_submission_id]) REFERENCES [dbo].[kpi_submission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_approver_id_fkey] FOREIGN KEY ([approver_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[approval] ADD CONSTRAINT [approval_approval_status_id_fkey] FOREIGN KEY ([approval_status_id]) REFERENCES [dbo].[approval_status]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[notification] ADD CONSTRAINT [notification_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[notification] ADD CONSTRAINT [notification_template_id_fkey] FOREIGN KEY ([template_id]) REFERENCES [dbo].[notification_template]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[application_log] ADD CONSTRAINT [application_log_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
