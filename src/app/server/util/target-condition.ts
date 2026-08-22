import { ConditionName } from "../enum/enum";

export function evaluateTargetCondition(
  value: number,
  condition: ConditionName,
  target: number,
): boolean {
  switch (condition) {
    case ConditionName.GREATER_THAN:
      return value > target;

    case ConditionName.LESS_THAN:
      return value < target;

    case ConditionName.GREATER_THAN_OR_EQUAL:
      return value >= target;

    case ConditionName.LESS_THAN_OR_EQUAL:
      return value <= target;

    case ConditionName.EQUAL:
      return value === target;

    default:
      return false;
  }
}