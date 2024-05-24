import {NextRequest, NextResponse} from "next/server";
import Stripe from "stripe";
import db from "@/db/db";
import {Resend} from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SCRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req:NextRequest) {
    const event = await stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') as string, process.env.STRIPE_WEBHOOK_SECRET as string)

    if(event.type === 'charge.succeeded') {
        const charge = event.data.object
        const productId = charge.metadata.productId
        const email = charge.billing_details.email
        const pricePaidInCents = charge.amount

        const product = await db.product.findUnique({where: {id: productId}})
        if(product == null || email == null ) return new NextResponse('Bad request', {status: 400})


        const userFields = {
            email,
            orders: { create: {productId, pricePaidInCents }},
        }
        const {orders: [order]} = await db.user.upsert({
            where: {email},
            create: userFields,
            update: userFields,
            select: {orders: {orderBy: {createdAt: 'desc'}, take: 1}}
        })

        const downloadVerification = await db.downloadVerification.create({data: {
                productId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
        }})

        await resend.emails.send({
            from: 'Shop - Raian Melon <trgovina@raianmelon.com>',
            to: email,
            subject: 'Order Confirmation',
            react: <PurchaseReceiptEmail product={product} order={order} downloadVerificationId={downloadVerification.id} />
        })

        return new NextResponse('Success', {status: 200})
    }

    return new NextResponse('Event not supported', {status: 404})
}