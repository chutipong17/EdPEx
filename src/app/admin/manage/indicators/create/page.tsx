import { IndicatorForm } from "@/components/manage/Indicators/indicator-form";
import { IndicatorLayout } from "@/components/manage/Indicators/indicator-layout";
export default function CreateIndicatorPage() {
  return (
    <IndicatorLayout>
      <IndicatorForm mode="create" title="เพิ่มตัวชี้วัด" />
    </IndicatorLayout>
  );
}
