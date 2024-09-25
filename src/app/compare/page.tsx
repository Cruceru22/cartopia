"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/trpc/react";

export default function ComparePage() {
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const { data: makes, isLoading: isLoadingMakes } = api.cars.makes.useQuery();
  const { data: models, isLoading: isLoadingModels } = api.cars.models.useQuery(
    { make_id: selectedMakeId!, year: selectedYear! },
    { enabled: selectedMakeId !== null && selectedYear !== null }
  );

  const years = [2015, 2016, 2017, 2018, 2019, 2020];

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center justify-between"
            >
              <Link href="/">
                <Button variant="ghost" className="flex items-center">
                  <ChevronLeft className="mr-2" size={24} />
                  Back to Home
                </Button>
              </Link>
              <h1 className="flex items-center text-3xl font-bold text-blue-600">
                <Car className="mr-2" size={32} />
                Cartopia
              </h1>
            </motion.div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Select a Car</CardTitle>
                <CardDescription>Choose a make, year, and model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Select
                    onValueChange={(value) => {
                      setSelectedMakeId(Number(value));
                      setSelectedYear(null);
                      setSelectedModelId(null);
                    }}
                    value={selectedMakeId?.toString()}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingMakes ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        makes?.map((make) => (
                          <SelectItem key={make.id} value={make.id.toString()}>
                            {make.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) => {
                      setSelectedYear(Number(value));
                      setSelectedModelId(null);
                    }}
                    value={selectedYear?.toString()}
                    disabled={!selectedMakeId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) => setSelectedModelId(Number(value))}
                    value={selectedModelId?.toString()}
                    disabled={!selectedMakeId || !selectedYear}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingModels ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        models?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedMakeId && selectedYear && selectedModelId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Selected Car</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Make: {makes?.find(make => make.id === selectedMakeId)?.name}</p>
                    <p>Year: {selectedYear}</p>
                    <p>Model: {models?.find(model => model.id === selectedModelId)?.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}