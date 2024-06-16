export interface User {
  accessToken: string;
  refreshToken: string | null;
  expiredAt: Date;
}

export type ErrorMsg = {
  message: string;
};

export type Product = {
  itemId: string;
  title: string;
  image: { imageUrl: string };
  price: { currency: string; value: string };
  itemWebUrl: string;
  buyingOptions: [string];
  bidCount: number;
  currentBidPrice: { value: string };
  itemEndDate: string;
};

export enum Buying {
  BIN = "buyItNow",
  AUCTION = "auction",
}

export enum Sort {
  ENDING_SOONEST = "endingSoonest",
  NEWLY_LISTED = "newlyListed",
  LOWEST_PRICE = "price",
  HEIGHEST_PRICE = "-price",
}
