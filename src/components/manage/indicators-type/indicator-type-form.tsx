'use client'

import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Save} from 'lucide-react'

import { indicatorTypeSchema, type IndicatorTypeFormValues } from '@/lib/indicator-type-schema'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {DialogClose} from '@/components/ui/dialog'
import {Field,FieldGroup,FieldLabel,FieldError,} from '@/components/ui/field'


interface IndicatorTypeFormProps{
    defaultName?:string
    submitting?:boolean
    onSubmit:(values:  IndicatorTypeFormValues) => void
}

export function IndicatorTypeForm({
    defaultName = '',
    submitting= false,
    onSubmit,
}:IndicatorTypeFormProps){
    const {
        register,
        handleSubmit,
        formState:{errors},
    } = useForm<IndicatorTypeFormValues>({
        resolver:zodResolver(indicatorTypeSchema),
        defaultValues: {categoryName:defaultName},
        mode:'onSubmit',
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className='px-1 py-2'>
                <Field data-invalid={!!errors.categoryName || undefined}>
                    <FieldLabel htmlFor="department-name">
                        ประเภทตัวชี้วัด <span className='text-destructive'></span>
                    </FieldLabel>
                    <Input id="department-name" placeholder='กรอกประเภทตัวชี้วัด' autoComplete="off" aria-invalid={!!errors.categoryName || undefined} {...register('categoryName')} />
                    <FieldError errors = {errors.categoryName? [errors.categoryName] : undefined}/>
                </Field>
            </FieldGroup>

            <div className='-mx-4 -mb-4 mt-2 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:flex-row sm:justify-end'>
            <DialogClose render={
                <Button type="button" variant="outline" className="w-full sm:w-auto" />
            }>
                ย้อนกลับ
            </DialogClose>
            <Button type="submit" disabled={submitting} className="w-full gap-2 sm:w-auto">
            <Save className='size-4' aria-hidden="true" />
            บันทึกข้อมูล
            </Button>
            </div>
        </form>
    )
}
