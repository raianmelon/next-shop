import {Body, Container, Head, Heading, Hr, Html, Preview, Tailwind} from "@react-email/components";
import {OrderInformation} from "@/email/components/OrderInformation";
import React from 'react'

type OrderHistoryEmailProps = {
    orders: {
        id: string,
        createdAt: Date,
        pricePaidInCents: number,
        downloadVerificationId: string,
        product: {
            name: string,
            description: string,
            imagePath: string,
        },
    }[],
}

export default function OrderHistoryEmail({orders}: OrderHistoryEmailProps) {
    return (
        <Html>
            <Preview>Order History & Downloads</Preview>
            <Tailwind>
                <Head/>
                <Body className={'font-sans bg-white'}>
                    <Container className={'max-w-xl'}>
                        <Heading>Order History</Heading>
                        {orders.map((order, index) => (
                            <React.Fragment key={order.id}>
                                <OrderInformation order={order} product={order.product} downloadVerificationId={order.downloadVerificationId}/>
                                {index < orders.length -1 && <Hr/>}
                            </React.Fragment>
                        ))}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}