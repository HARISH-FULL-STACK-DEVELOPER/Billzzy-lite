// // src/app/api/products/route.ts
// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// // src/app/api/products/route.ts

// import dbConnect from '@/lib/mongodb';
// import Product from '@/models/Product';
// import { NextResponse } from 'next/server';

// /**
//  * A helper function to transform the MongoDB document.
//  * It converts the `_id` ObjectId to a string `id` and removes `_id` and `__v`.
//  */
// const transformProduct = (product: any) => {
//   const transformed = {
//     ...product,
//     id: product._id.toString(),
//   };
//   delete transformed._id;
//   delete transformed.__v; // Also remove the version key
//   return transformed;
// };

// // GET all products
// export async function GET() {
//   try {
//     await dbConnect();

//     // .lean() is a performance optimization that returns plain JavaScript objects
//     const productsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();

//     // ✅ Transform every product before sending the response
//     const products = productsFromDb.map(transformProduct);

//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('API GET Error:', error); // This log is crucial!
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json({ message: 'Failed to fetch products', error: errorMessage }, { status: 500 });
//   }
// }

// // POST a new product (handles both single and batch)
// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const body = await request.json();

//     if (Array.isArray(body)) {
//       // Logic for batch upload from Excel
//       if (body.length > 0) {
//         // Use { ordered: false } to continue inserting even if one document fails (e.g., duplicate SKU)
//         await Product.insertMany(body, { ordered: false }).catch(err => {
//             // We catch and log duplicate errors here but don't re-throw,
//             // allowing the operation to be partially successful.
//             if (err.code !== 11000) throw err;
//             console.warn("Batch insert contained duplicate SKUs which were ignored.");
//         });
//       }
//     } else {
//       // Logic for a single product creation
//       await Product.create(body);
//     }
    
//     // After creating, fetch and return the entire updated list, transformed
//     const allProductsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
//     const allProducts = allProductsFromDb.map(transformProduct);
    
//     return NextResponse.json(allProducts, { status: 201 });

//   } catch (error: any) {
//     console.error('API POST Error:', error);
    
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { message: 'A product with a duplicate SKU already exists.', error: error.message },
//         { status: 409 } // 409 Conflict
//       );
//     }
    
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json({ message: 'Failed to create product(s)', error: errorMessage }, { status: 500 });
//   }
// }


import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

const transformProduct = (product: any) => {
  const transformed = {
    ...product,
    id: product._id.toString(),
  };
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

// GET all products
export async function GET() {
  // ------------------- DEBUGGING START -------------------
  console.log("\n--- [GET /api/products] API Route Hit ---");

  try {
    console.log("1. Attempting to connect to database...");
    await dbConnect();
    console.log("2. Database connection successful.");

    console.log("3. Attempting to query the database using the 'Product' model...");
    // .lean() is a performance optimization
    const productsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
    
    console.log("4. Database query finished.");
    
    if (!productsFromDb) {
      console.log("   - RESULT: The query returned null or undefined.");
    } else {
      console.log(`   - RESULT: Found ${productsFromDb.length} documents in the collection.`);
      if (productsFromDb.length > 0) {
        console.log("   - First document sample:", JSON.stringify(productsFromDb[0], null, 2));
      }
    }

    const products = productsFromDb.map(transformProduct);
    console.log("5. Data transformation complete.");
    console.log("6. Sending data to the frontend.");
    console.log("--- [GET /api/products] Request Finished Successfully ---\n");
    // -------------------- DEBUGGING END --------------------

    return NextResponse.json(products);

  } catch (error) {
    console.error('!!! [FATAL API GET Error] An error occurred:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch products', error: errorMessage }, { status: 500 });
  }
}

// POST a new product (handles both single and batch)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (Array.isArray(body)) {
      if (body.length > 0) {
        await Product.insertMany(body, { ordered: false }).catch(err => {
            if (err.code !== 11000) throw err;
            console.warn("Batch insert contained duplicate SKUs which were ignored.");
        });
      }
    } else {
      await Product.create(body);
    }
    
    const allProductsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
    const allProducts = allProductsFromDb.map(transformProduct);
    
    return NextResponse.json(allProducts, { status: 201 });

  } catch (error: any) {
    console.error('API POST Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with a duplicate SKU already exists.', error: error.message },
        { status: 409 } // 409 Conflict
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to create product(s)', error: errorMessage }, { status: 500 });
  }
}
