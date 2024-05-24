import PageHeader from "@/app/admin/_components/PageHeader";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, MoreVertical, XCircle} from "lucide-react";
import {formatCurrency, formatNumber} from "@/lib/formatters";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ActiveToggleDropdownItem, DeleteDropdownItem} from "@/app/admin/products/_components/ProductActions";
import {getProducts} from "@/app/admin/_actions/products";

export default function AdminProductPage() {
    return <>
        <div className={'flex justify-between items-center gap-4'}>
            <PageHeader>Products</PageHeader>
            <Button asChild>
                <Link href={'/admin/products/new'}>Add product</Link>
            </Button>
        </div>
        <ProductsTable/>
    </>
}

async function ProductsTable() {
    const products = await getProducts()

    if (products.length === 0) return <p>No products found</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className={'w-0'}></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className={'w-0'}></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products?.map(product => (
                <TableRow key={product.id}>
                    <TableCell>
                        {product.isAvailableForPurchase ? <CheckCircle2 className={'stroke-green-600'} /> : <XCircle className={'stroke-destructive'}/>}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
                    <TableCell>{formatNumber(product._count.orders)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <a download href={`/admin/products/${product.id}/download`}>Download</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                                <DropdownMenuSeparator />
                                <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}