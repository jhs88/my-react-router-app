type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

type OfferProps = {
  subOfferType?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  disclaimers?: string;
  financeType?: string;
  customerType?: string;
  productLine?: string;
  imageContainer?: string;
  rate?: string;
  isFeatured?: boolean;
  additionalCashSavings?: string;
  termsInMonths?: string;
  retailBonus?: string;
  npniMonth?: string;
  npniYear?: string;
  percentOff?: string;
  cashSavings?: string;
  secondaryHeading?: string;
  description?: string;
  eligibleEquipments?: string;
};

type SerializeFrom<T> = ReturnType<typeof useLoaderData<T>>;
