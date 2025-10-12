import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { ErrorMsg, Product, Sort, User } from "./definitions";

export async function authenticate(): Promise<User | ErrorMsg | null> {
  let date = new Date();
  const user = await getAuthentication();
  console.log("User from DB:", user);
  if (user === null || user === undefined) {
    console.log("No user found, setting authentication");
    return await setAuthentication();
  } else if ("accessToken" in user && date > user.expiredAt) {
    console.log("Token expired, refreshing");
    return await setAuthentication(true);
  }
  console.log("Using existing token");
  return user;
}

export async function setAuthentication(del: boolean = false) {
  try {
    const prisma = new PrismaClient();
    const EbayAuthToken = require("ebay-oauth-nodejs-client");
    const ebayAuthToken = new EbayAuthToken({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    console.log("Getting eBay application token");
    const response = await ebayAuthToken.getApplicationToken("PRODUCTION");
    const data = await JSON.parse(response);
    console.log("eBay token response:", data);
    let date = new Date();
    date.setSeconds(data.expires_in);

    if (del === true) {
      await prisma.user.deleteMany({});
    }

    return await prisma.user.create({
      data: {
        accessToken: data.access_token,
        expiredAt: date,
      },
      select: {
        accessToken: true,
        refreshToken: true,
        expiredAt: true,
      },
    });
  } catch (error) {
    console.error("Error in setAuthentication:", error);
    return { message: "database error:" + error };
  }
}

export async function getAuthentication(): Promise<
  User | ErrorMsg | null | undefined
> {
  try {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      select: {
        accessToken: true,
        refreshToken: true,
        expiredAt: true,
      },
    });
    return user;
  } catch (error) {
    return { message: "database error:" + error };
  }
}

export async function fetchEbayProducts(
  currentPage: number,
  q?: string,
  sort?: Sort,
  buyItNow?: boolean,
  auction?: boolean
) {
  noStore();
  try {
    const data = await authenticate();
    if (data === undefined || data === null || "message" in data)
      throw new Error("Authentication Failed");
    const limit = 24;
    const offset = (currentPage - 1) * 24;
    const catId = 4196;

    const params = new URLSearchParams();

    params.set("category_ids", catId.toString());
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());

    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);

    //filter
    let filter = "";
    if (buyItNow) filter += "buyingOptions:{FIXED_PRICE}";
    else if (auction) filter += "buyingOptions:{AUCTION}";
    else filter += "buyingOptions:{FIXED_PRICE|AUCTION}";
    params.set("filter", filter);

    const response = await fetch(
      "https://api.ebay.com/buy/browse/v1/item_summary/search?" +
        params.toString(),
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + data?.accessToken,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const products = await response.json();
    
    // Limit total pages to prevent UI issues with very large datasets
    const maxReasonablePages = 1000; // Allow up to 1000 pages (24,000 items)
    const calculatedPages = Math.ceil(products.total / limit);
    const totalPages = Math.min(calculatedPages, maxReasonablePages);
    
    return {
      items: products.itemSummaries,
      totalPages: totalPages,
      actualTotal: products.total, // Keep the actual total for informational purposes
      limit: limit, // Return the limit so other components can use it
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products.");
  }
}
