import { InferInsertModel } from "drizzle-orm"

// Database
import { quotes } from "@database/schema"

type QuotesSeedData = InferInsertModel<typeof quotes>[]

export const quotesSeedData: QuotesSeedData = [
  {
    author: "Homer Simpson",
    text: "Trying is the first step toward failure.",
  },
  {
    author: "Robert Penn Warren",
    text:
      "You have to make the good out of the bad because that is all you have got to make it out of.",
  },
  {
    author: "",
    text: "The best things in life are actually really expensive.",
  },
  {
    author: "Latrell Sprewell",
    text: "Success is just failure that hasn't happened yet.",
  },
  {
    author: "Dwight Schrute",
    text: "Not everything is a lesson. Sometimes you just fail.",
  },
  {
    author: "W.C. Fields",
    text:
      "If at first you don't succeed, try, try again. Then quit. No use being a damn fool about it.",
  },
  {
    author: "Dom Mazzetti",
    text: "Challenging yourself...is a good way to fail.",
  },
  {
    author: "John Benfield",
    text: "Eagles may soar, but weasels don't get sucked into jet engines.",
  },
  {
    author: "Dorothy Parker",
    text:
      "If you want to know what God thinks of money, just look at the people he gave it to.",
  },
  {
    author: "Harry Hill",
    text:
      "It's only when you look at an ant through a magnifying glass on a sunny day that you realize how often they burst into flames.",
  },
]
