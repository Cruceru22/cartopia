import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getCarMakes, getCarModels } from "./cars.utils";

export const carsRouter = createTRPCRouter({
  makes: publicProcedure.query(async () => {
    const carMake = await getCarMakes()
    return carMake.data
  }),
  models: publicProcedure
    .input(z.object({
      make_id: z.number(),
      year: z.number()
    }))
    .query(async ({ input }) => {
      const carModel = await getCarModels(input.make_id, input.year)
      return carModel.data
    })
});