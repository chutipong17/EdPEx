export enum Role {
  ADMIN = 1,
  USER = 2,
  EXECUTIVE = 3,
}

export enum Permission {
  CAN_CREATE = 1,
  CAN_VIEW = 2,
  CAN_EDIT = 3,
  CAN_DELETE = 4,
}

export enum Organization {
  UBRU = 'UBRU',
}

export enum KpiSubmissionStatus {
  PENDING = 1,
  SUBMITTED = 2
}

export enum ConditionName {
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
  EQUAL = "=",
}

export enum KpiDashboardStatus {
  NO_DATA = 1, //ไม่มีข้อมูล
  NOT_ACHIEVED = 2, //ไม่บรรลุเป้าหมาย
  TARGET_ACHIEVED = 3, //บรรลุเป้าหมาย
}

export enum KpiStatus {
  NODATA = "ไม่มีข้อมูล",
  NOT_ACHIEVED = "ไม่บรรลุเป้าหมาย",
  TARGET_ACHIEVED = "บรรลุเป้าหมาย",
}