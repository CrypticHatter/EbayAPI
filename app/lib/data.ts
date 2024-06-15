import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { ErrorMsg, Product, Sort, User } from "./definitions";

export async function authenticate(): Promise<User | ErrorMsg | null> {
  let date = new Date();
  const user = await getAuthentication();
  if (user === null || user === undefined) {
    return await setAuthentication();
  } else if ("accessToken" in user && date > user.expiredAt) {
    return await setAuthentication(true);
  }
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
    const response = await ebayAuthToken.getApplicationToken("PRODUCTION");
    const data = await JSON.parse(response);
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
    const catId = 64482;

    const params = new URLSearchParams();

    params.set("category_ids", catId.toString());
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());

    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);

    //filter
    let filter = "sellers:{pc_pirate|bblivingston83}";
    if (buyItNow) filter += ",buyingOptions:{FIXED_PRICE}";
    else if (auction) filter += ",buyingOptions:{AUCTION}";
    else filter += ",buyingOptions:{FIXED_PRICE|AUCTION}";
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

    return {
      items: products.itemSummaries,
      totalPages: Math.ceil(products.total / limit),
    };
  } catch (error) {
    throw new Error("Failed to fetch products.");
  }
}
