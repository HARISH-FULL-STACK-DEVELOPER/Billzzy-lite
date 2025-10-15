// // src/app/api/products/route.ts
// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const products = await prisma.product.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return new NextResponse(JSON.stringify({ message: 'Failed to fetch products', error: errorMessage }), { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     if (Array.isArray(body)) {
//       // --- BATCH UPLOAD ---
//       const incomingProducts = body.map((product, index) => ({
//         name: String(product.name || ''),
//         quantity: Number(product.quantity) || 0,
//         buyingPrice: Number(product.buyingPrice) || 0,
//         sellingPrice: Number(product.sellingPrice) || 0,
//         gstRate: Number(product.gstRate) || 0,
//         description: String(product.description || ''),
//         sku: product.sku ? String(product.sku) : `SKU-${Date.now()}-${index}`,
//         image: product.image || null,
//       }));

//       const incomingSkus = incomingProducts.map(p => p.sku);
//       const existingProducts = await prisma.product.findMany({
//         where: { sku: { in: incomingSkus } },
//         select: { sku: true },
//       });
//       const existingSkus = new Set(existingProducts.map(p => p.sku));
//       const productsToCreate = incomingProducts.filter(p => !existingSkus.has(p.sku));

//       if (productsToCreate.length > 0) {
//         await prisma.product.createMany({ data: productsToCreate });
//       }
//     } else {
//       // --- SINGLE PRODUCT ---
//       const { sku, ...restOfBody } = body;
//       const productSKU = sku || `SKU-${Date.now()}`;

//       await prisma.product.upsert({
//         where: { sku: productSKU },
//         update: { ...restOfBody }, // update existing product if SKU exists
//         create: { ...restOfBody, sku: productSKU }, // create if not exists
//       });
//     }

//     const allProducts = await prisma.product.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//     return NextResponse.json(allProducts, { status: 201 });
//   } catch (error) {
//     console.error('Failed to create product(s):', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return new NextResponse(JSON.stringify({ message: 'Failed to create product(s)', error: errorMessage }), { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { sequelize } from "@/models/db";

sequelize.sync();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    await Product.update(body, { where: { id: params.id } });
    const updated = await Product.findByPk(params.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await Product.destroy({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
