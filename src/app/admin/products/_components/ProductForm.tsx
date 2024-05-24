'use client'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import Image from "next/image";
import {formatCurrency} from "@/lib/formatters";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import { useFormStatus, useFormState } from "react-dom";
import {addProduct, updateProduct} from "../../_actions/products";
import {Product} from "@prisma/client";

export function ProductForm ({product}: {product?: Product | null}) {
    const [error,action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)

    return <form action={action} className={'space-y-8'}>
        <div className={'space-y-2'}>
            <Label htmlFor='name'>Name</Label>
            <Input type={'text'} id={'name'} name={'name'} defaultValue={product?.name || ""} required/>
            {error.name && <div className='text-destructive'>{error.name}</div>}
        </div>
        <div className={'space-y-2'}>
            <Label htmlFor='priceInCents'>Price In Cents</Label>
            <Input type={'number'} id={'priceInCents'} name={'priceInCents'} required value={priceInCents} onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}/>
            <div className={'text-muted-foreground'}>{formatCurrency((priceInCents || 0) /100)}</div>
            {error.priceInCents && <div className='text-destructive'>{error.priceInCents}</div>}
        </div>
        <div className={'space-y-2'}>
            <Label htmlFor='description'>Description</Label>
            <Textarea id={'description'} name={'description'} defaultValue={product?.description || ""} required/>
            {error.description && <div className='text-destructive'>{error.description}</div>}
        </div>
        <div className={'space-y-2'}>
            <Label htmlFor='file'>File</Label>
            <Input type={'file'} id={'file'} name={'file'} required={product == null} />
            {product != null && <div className={'text-destructive'}>{product.filePath}</div>}
            {error.file && <div className='text-destructive'>{error.file}</div>}
        </div>
        <div className={'space-y-2'}>
            <Label htmlFor='image'>Image</Label>
            <Input type={'file'} id={'image'} name={'image'} required={product == null} />
            {product != null && <Image src={product.imagePath} height={400} width={400} alt={'Product Image'} />}
            {error.image && <div className='text-destructive'>{error.image}</div>}
        </div>
        <SubmitButton/>
    </form>
}

function SubmitButton() {
    const {pending} = useFormStatus()
    return <Button type={'submit'} disabled={pending}>{pending ? 'Saving...' : 'Save'}</Button>
}