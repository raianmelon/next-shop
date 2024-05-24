import {Body, Container, Head, Heading, Html, Preview, Tailwind} from "@react-email/components";
import {OrderInformation} from "@/email/components/OrderInformation";

type PurchaseReciepEmailProps = {
    product: {
        name: string,
        description: string,
        imagePath: string
    },
    order: {
        id: string,
        createdAt: Date,
        pricePaidInCents: number
    },
    downloadVerificationId: string
}

export default function PurchaseReceiptEmail({product, order, downloadVerificationId}: PurchaseReciepEmailProps) {
    return (
        <Html>
            <Preview>Download {product.name} and view reciept</Preview>
            <Tailwind>
                <Head/>
                <Body className={'font-sans bg-white'}>
                    <Container className={'max-w-xl'}>
                        <Heading>Purchase Reciept</Heading>
                        <OrderInformation order={order} product={product} downloadVerificationId={downloadVerificationId}/>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}