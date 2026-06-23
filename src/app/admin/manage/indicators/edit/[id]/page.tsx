import { notFound } from "next/navigation";

import { IndicatorForm } from "@/components/manage/Indicators/indicator-form";
import { getIndicatorById } from "@/lib/mock-indicators";
import { indicatorToFormValues } from "@/lib/indicator-mapper";
import { IndicatorLayout } from "@/components/manage/Indicators/indicator-layout";
export default async function EditIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const indicator = getIndicatorById(id);

  if (!indicator) {
    notFound();
  }

  return (
    <IndicatorLayout>
      <IndicatorForm
        mode="edit"
        title="แก้ไขตัวชี้วัด"
        initialValues={indicatorToFormValues(indicator)}
      />
    </IndicatorLayout>
  );
}
