import { IndicatorList } from "@/components/manage/Indicators/indicator-list"
import { indicators } from "@/lib/mock-indicators"
import { IndicatorLayout } from "@/components/manage/Indicators/indicator-layout"
export default function IndicatorsPage() {
  return (

    <IndicatorLayout>
        <IndicatorList indicators={indicators} />
    </IndicatorLayout>
   

    // <div>
    //     <h1>IndicatorsPage </h1>
    // </div>
  )
  
//   <IndicatorList indicators={indicators} />
}

