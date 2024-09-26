import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getCarMakes, getCarModels, getCarTrims, getEngineDetails } from "./cars.utils";

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
    }),
    trims: publicProcedure
  .input(z.object({
    modelId: z.number(),
    year: z.number(),
    make_id: z.number()
  }))
  .query(async ({ input }) => {
    const carTrims = await getCarTrims(input.modelId, input.year, input.make_id);
    return carTrims.data;
  }),

  engine: publicProcedure
  .input(z.object({
    trimId: z.number()
  }))
  .query(async ({ input }) => {
    const engine = await getEngineDetails(input.trimId);
    return engine.data;
  })
});

