
// // src/app/api/products/[id]/route.ts (Corrected)

// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// // This runs when you want to UPDATE a product
// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
// ) {
//   try {
//     const { id } = await params; // <-- Await params to get the id
//     const body = await request.json();

//     // It's good practice to not pass the id from the body to the update data
//     const { id: _, ...updateData } = body;

//     const updatedProduct = await prisma.product.update({
//       where: { id: id },
//       data: updateData,
//     });

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.error("Failed to update product:", error);
//     return NextResponse.json(
//       { message: "Failed to update product", error },
//       { status: 500 }
//     );
//   }
// }

// // This runs when you want to DELETE a product
// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
// ) {
//   try {
//     const { id } = await params; // <-- Await params to get the id

//     await prisma.product.delete({
//       where: { id },
//     });

//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Failed to delete product:", error);
//     return NextResponse.json(
//       { message: "Failed to delete product", error },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { sequelize } from "@/models/db";

sequelize.sync();

export async function GET() {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      await Product.bulkCreate(body, { ignoreDuplicates: true });
    } else {
      await Product.upsert(body);
    }

    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
