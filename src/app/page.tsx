"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, BarChart2, Zap, Shield, Car, DollarSign, Gauge } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

interface CarSelection {
  makeId: number | null;
  year: number | null;
  modelId: number | null;
  trimId: number | null;
}

interface Engine {
  id: number;
  make_model_trim_id: number;
  engine_type: string;
  fuel_type: string;
  cylinders: string;
  size: string;
  horsepower_hp: number;
  horsepower_rpm: number;
  torque_ft_lbs: number;
  torque_rpm: number;
  valves: number;
  valve_timing: string;
  cam_type: string;
  drive_type: string;
  transmission: string;
}

export default function LandingPage() {
  const [carSelection, setCarSelection] = useState<CarSelection>({
    makeId: null,
    year: null,
    modelId: null,
    trimId: null,
  });

  const { data: makes, isLoading: isLoadingMakes } = api.cars.makes.useQuery();
  const years = [2015, 2016, 2017, 2018, 2019, 2020];

  const { data: models, isLoading: isLoadingModels } = api.cars.models.useQuery(
    { make_id: carSelection.makeId!, year: carSelection.year! },
    { enabled: carSelection.makeId !== null && carSelection.year !== null }
  );

  const { data: trims, isLoading: isLoadingTrims } = api.cars.trims.useQuery(
    {
      modelId: carSelection.modelId!,
      year: carSelection.year!,
      make_id: carSelection.makeId!,
    },
    { enabled: carSelection.modelId !== null && carSelection.year !== null }
  );

  const { data: engine, isLoading: isLoadingEngineDetails } = api.cars.engine.useQuery<Engine[]>(
    { trimId: carSelection.trimId! },
    { enabled: carSelection.trimId !== null }
  );

  const handleSelectionChange = (field: keyof CarSelection, value: number | null) => {
    setCarSelection((prev) => {
      const newSelection = { ...prev, [field]: value };
      if (field !== "trimId") {
        newSelection.trimId = null;
      }
      if (field !== "modelId" && field !== "trimId") {
        newSelection.modelId = null;
      }
      if (field === "makeId") {
        newSelection.year = null;
        newSelection.modelId = null;
        newSelection.trimId = null;
      }
      return newSelection;
    });
  };

  const renderCarDetails = () => {
    if (!carSelection.trimId) return null;

    const selectedMake = makes?.find((make) => make.id === carSelection.makeId);
    const selectedModel = models?.find((model) => model.id === carSelection.modelId);
    const selectedTrim = trims?.find((trim) => trim.id === carSelection.trimId);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <CardTitle className="text-3xl font-bold flex items-center">
              <Car className="mr-2" size={28} />
              {selectedMake?.name} {selectedModel?.name} {selectedTrim?.name}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {carSelection.year} Model
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <DollarSign className="mr-2" size={20} />
                  Pricing
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">MSRP:</span>
                    <span className="text-2xl font-bold">${selectedTrim?.msrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Invoice:</span>
                    <span className="text-xl">${selectedTrim?.invoice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  {/* <Engine className="mr-2" size={20} /> */}
                  Engine Specs
                </h3>
                {isLoadingEngineDetails ? (
                  <p>Loading engine details...</p>
                ) : engine ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge variant="secondary">{engine[0]?.engine_type}</Badge>
                      <p><span className="font-semibold">Fuel:</span> {engine[0]?.fuel_type}</p>
                      <p><span className="font-semibold">Size:</span> {engine[0]?.size}</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Cylinders:</span> {engine[0]?.cylinders}</p>
                      <p><span className="font-semibold">Valves:</span> {engine[0]?.valves}</p>
                      <p><span className="font-semibold">Transmission:</span> {engine[0]?.transmission}</p>
                    </div>
                  </div>
                ) : (
                  <p>No engine details available</p>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Gauge className="mr-2" size={20} />
                Performance
              </h3>
              {engine && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Horsepower</p>
                    <p className="text-2xl">{engine[0]?.horsepower_hp} hp @ {engine[0]?.horsepower_rpm} rpm</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Torque</p>
                    <p className="text-2xl">{engine[0]?.torque_ft_lbs} ft-lbs @ {engine[0]?.torque_rpm} rpm</p>
                  </div>
                </div>
              )}
            </div>
            <Separator className="my-6" />
            <div>
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700">{selectedTrim?.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-blue-600 mb-4">Cartopia</h1>
          <p className="text-xl text-gray-600">Find your perfect ride with ease</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="grid grid-cols-2 gap-4">
            <Select
              onValueChange={(value) => handleSelectionChange("makeId", Number(value))}
              value={carSelection.makeId?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingMakes ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
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
              onValueChange={(value) => handleSelectionChange("year", Number(value))}
              value={carSelection.year?.toString()}
              disabled={!carSelection.makeId}
            >
              <SelectTrigger>
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
              onValueChange={(value) => handleSelectionChange("modelId", Number(value))}
              value={carSelection.modelId?.toString()}
              disabled={!carSelection.makeId || !carSelection.year}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  models?.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => handleSelectionChange("trimId", Number(value))}
              value={carSelection.trimId?.toString()}
              disabled={!carSelection.modelId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Trim" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTrims ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  trims?.map((trim) => (
                    <SelectItem key={trim.id} value={trim.id.toString()}>
                      {trim.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {renderCarDetails()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { icon: BarChart2, title: "Compare Models", description: "Side-by-side comparison of your favorite cars" },
            { icon: Zap, title: "Fast & Easy", description: "Get the information you need in seconds" },
            { icon: Shield, title: "Trusted Data", description: "Reliable specs from authoritative sources" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <feature.icon className="mx-auto mb-4 text-blue-500" size={40} />
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/compare">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Start Comparing <ChevronRight className="ml-2" size={24} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}