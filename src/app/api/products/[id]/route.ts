// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product"; 

// A helper function to transform the MongoDB document.
const transformProduct = (product: any) => {
  const transformed = {
    // Use .toObject() or .lean() before this function is called
    ...product,
    id: product._id.toString(),
  };
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

// --- UPDATE a single product by its ID ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await request.json();

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }

    // CORRECTED: After updating, fetch the entire updated list of products.
    // This makes the PUT response consistent with the POST response.
    const allProductsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
    const allProducts = allProductsFromDb.map(transformProduct);
    
    return NextResponse.json(allProducts);

  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Failed to update product", error: `${error}` },
      { status: 500 }
    );
  }
}

// --- DELETE a single product by its ID ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }
    
    // Return a success response with no body, which is standard for DELETE
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error: `${error}` },
      { status: 500 }
    );
  }
}
