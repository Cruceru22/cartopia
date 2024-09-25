"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Star, Car } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

interface CarModel {
  id: number;
  name: string;
}

interface CarSpec {
  price: string;
  mpg: string;
  horsepower: string;
  acceleration: string;
  rating: number;
}

// Mock data for car models and specifications
const carModels: CarModel[] = [
  { id: 1, name: "Tesla Model 3" },
  { id: 2, name: "Toyota Camry" },
  { id: 3, name: "Honda Civic" },
  { id: 4, name: "Ford Mustang" },
  { id: 5, name: "BMW 3 Series" },
];

const carSpecs: { [key: number]: CarSpec } = {
  1: {
    price: "$39,990",
    mpg: "142 MPGe",
    horsepower: "283 hp",
    acceleration: "5.3s 0-60 mph",
    rating: 4.8,
  },
  2: {
    price: "$25,295",
    mpg: "28 city / 39 hwy",
    horsepower: "203 hp",
    acceleration: "7.6s 0-60 mph",
    rating: 4.5,
  },
  3: {
    price: "$22,350",
    mpg: "31 city / 40 hwy",
    horsepower: "158 hp",
    acceleration: "8.2s 0-60 mph",
    rating: 4.7,
  },
  4: {
    price: "$27,470",
    mpg: "21 city / 32 hwy",
    horsepower: "310 hp",
    acceleration: "5.1s 0-60 mph",
    rating: 4.6,
  },
  5: {
    price: "$41,450",
    mpg: "26 city / 36 hwy",
    horsepower: "255 hp",
    acceleration: "5.6s 0-60 mph",
    rating: 4.4,
  },
};

export default function ComparePage() {
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const handleCarSelect = (carId: number) => {
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter((id) => id !== carId));
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Compare Cars
                  </CardTitle>
                  <CardDescription>
                    Select up to three models to compare side-by-side
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {carModels.map((car) => (
                      <Button
                        key={car.id}
                        variant={
                          selectedCars.includes(car.id) ? "default" : "outline"
                        }
                        onClick={() => handleCarSelect(car.id)}
                        className={
                          selectedCars.includes(car.id)
                            ? "bg-blue-500 text-white"
                            : ""
                        }
                      >
                        {car.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {selectedCars.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Comparison Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">
                              Specification
                            </TableHead>
                            {selectedCars.map((carId) => (
                              <TableHead key={carId}>
                                {carModels.find((car) => car.id === carId)
                                  ?.name || "Unknown"}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(
                            [
                              "price",
                              "mpg",
                              "horsepower",
                              "acceleration",
                            ] as (keyof CarSpec)[]
                          ).map((spec) => (
                            <TableRow key={spec}>
                              <TableCell className="font-medium capitalize">
                                {spec}
                              </TableCell>
                              {selectedCars.map((carId) => (
                                <TableCell key={carId}>
                                  {carSpecs[carId]?.[spec] || "N/A"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-medium">
                              User Rating
                            </TableCell>
                            {selectedCars.map((carId) => (
                              <TableCell
                                key={carId}
                                className="flex items-center gap-1"
                              >
                                {carSpecs[carId] ? (
                                  <>
                                    {renderStars(carSpecs[carId].rating)}
                                    <span className="ml-1">
                                      ({carSpecs[carId].rating})
                                    </span>
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
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
