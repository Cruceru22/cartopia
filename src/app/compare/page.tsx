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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

interface CarSelection {
  makeId: number | null;
  year: number | null;
  modelId: number | null;
  trimId: number | null;
}

export default function ComparePage() {
  const [carSelections, setCarSelections] = useState<
    [CarSelection, CarSelection]
  >([
    { makeId: null, year: null, modelId: null, trimId: null },
    { makeId: null, year: null, modelId: null, trimId: null },
  ]);

  const { data: makes, isLoading: isLoadingMakes } = api.cars.makes.useQuery();
  const years = [2015, 2016, 2017, 2018, 2019, 2020];

  // Queries for car 1
  const { data: engine1 } = api.cars.engine.useQuery<Engine[]>(
    { trimId: carSelections[0].trimId! },
    { enabled: carSelections[0].trimId !== null },
  );
  const { data: trims1 } = api.cars.trims.useQuery(
    {
      modelId: carSelections[0].modelId!,
      year: carSelections[0].year!,
      make_id: carSelections[0].makeId!,
    },
    {
      enabled:
        carSelections[0].modelId !== null &&
        carSelections[0].year !== null &&
        carSelections[0].makeId !== null,
    },
  );

  // Queries for car 2
  const { data: engine2 } = api.cars.engine.useQuery<Engine[]>(
    { trimId: carSelections[1].trimId! },
    { enabled: carSelections[1].trimId !== null },
  );
  const { data: trims2 } = api.cars.trims.useQuery(
    {
      modelId: carSelections[1].modelId!,
      year: carSelections[1].year!,
      make_id: carSelections[1].makeId!,
    },
    {
      enabled:
        carSelections[1].modelId !== null &&
        carSelections[1].year !== null &&
        carSelections[1].makeId !== null,
    },
  );

  const handleSelectionChange = (
    index: number,
    field: keyof CarSelection,
    value: number | null,
  ) => {
    setCarSelections((prev) => {
      const newSelections = [...prev];
      if (newSelections[index]) {
        newSelections[index] = { ...newSelections[index], [field]: value };
      }
      if (field !== "trimId" && newSelections[index]) {
        newSelections[index] = { ...newSelections[index], trimId: null };
      }
      if (field !== "modelId" && field !== "trimId" && newSelections[index]) {
        newSelections[index] = { ...newSelections[index], modelId: null };
      }
      if (field === "makeId" && newSelections[index]) {
        newSelections[index] = {
          ...newSelections[index],
          year: null,
          modelId: null,
          trimId: null,
        };
      }
      return newSelections as [CarSelection, CarSelection];
    });
  };

  const renderCarSelector = (index: number) => {
    const selection = carSelections[index];
    const { data: models, isLoading: isLoadingModels } =
      api.cars.models.useQuery(
        { make_id: selection?.makeId!, year: selection?.year! },
        { enabled: selection?.makeId !== null && selection?.year !== null },
      );
    const { data: trims, isLoading: isLoadingTrims } = api.cars.trims.useQuery(
      {
        modelId: selection?.modelId!,
        year: selection?.year!,
        make_id: selection?.makeId!,
      },
      { enabled: selection?.modelId !== null && selection?.year !== null },
    );

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Select Car {index + 1}
          </CardTitle>
          <CardDescription>
            Choose a make, year, model, and trim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select
              onValueChange={(value) =>
                handleSelectionChange(index, "makeId", Number(value))
              }
              value={selection?.makeId?.toString()}
            >
              <SelectTrigger className="w-[180px]">
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
              onValueChange={(value) =>
                handleSelectionChange(index, "year", Number(value))
              }
              value={selection?.year?.toString()}
              disabled={!selection?.makeId}
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
              onValueChange={(value) =>
                handleSelectionChange(index, "modelId", Number(value))
              }
              value={selection?.modelId?.toString()}
              disabled={!selection?.makeId || !selection.year}
            >
              <SelectTrigger className="w-[180px]">
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
              onValueChange={(value) =>
                handleSelectionChange(index, "trimId", Number(value))
              }
              value={selection?.trimId?.toString()}
              disabled={!selection?.modelId}
            >
              <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>
    );
  };

  const renderCarDetails = (index: number) => {
    const selection = carSelections[index];
    const { data: engine, isLoading: isLoadingEngineDetails } =
      api.cars.engine.useQuery<Engine[]>(
        { trimId: selection?.trimId! },
        { enabled: selection?.trimId !== null },
      );
    const { data: trims } = api.cars.trims.useQuery(
      {
        modelId: selection?.modelId!,
        year: selection?.year!,
        make_id: selection?.makeId!,
      },
      { enabled: selection?.modelId !== null && selection?.year !== null },
    );
    const { data: models } = api.cars.models.useQuery(
      { make_id: selection?.makeId!, year: selection?.year! },
      { enabled: selection?.makeId !== null && selection?.year !== null },
    );

    if (!selection?.trimId) return null;

    const selectedModel = models?.find(
      (model) => model.id === selection.modelId,
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Car {index + 1} Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Make: {makes?.find((make) => make.id === selection.makeId)?.name}
          </p>
          <p>Year: {selection.year}</p>
          <p>Model: {selectedModel?.name}</p>
          <p>
            Trim: {trims?.find((trim) => trim.id === selection.trimId)?.name}
          </p>
          <p>
            Description:{" "}
            {trims?.find((trim) => trim.id === selection.trimId)?.description}
          </p>
          <p>
            MSRP: $
            {trims
              ?.find((trim) => trim.id === selection.trimId)
              ?.msrp.toLocaleString()}
          </p>
          <p>
            Invoice: $
            {trims
              ?.find((trim) => trim.id === selection.trimId)
              ?.invoice.toLocaleString()}
          </p>

          {isLoadingEngineDetails ? (
            <p>Loading engine details...</p>
          ) : engine ? (
            <>
              <h3 className="mt-4 text-xl font-semibold">Engine Details</h3>
              <p>Engine Type: {engine[0]?.engine_type ?? "N/A"}</p>
              <p>Fuel Type: {engine[0]?.fuel_type ?? "N/A"}</p>
              <p>Cylinders: {engine[0]?.cylinders ?? "N/A"}</p>
              <p>Size: {engine[0]?.size ?? "N/A"}</p>
              <p>
                Horsepower:{" "}
                {engine[0]?.horsepower_hp && engine[0]?.horsepower_rpm
                  ? `${engine[0].horsepower_hp} hp @ ${engine[0].horsepower_rpm} rpm`
                  : "N/A"}
              </p>
              <p>
                Torque:{" "}
                {engine[0]?.torque_ft_lbs && engine[0]?.torque_rpm
                  ? `${engine[0].torque_ft_lbs} ft-lbs @ ${engine[0].torque_rpm} rpm`
                  : "N/A"}
              </p>
              <p>Valves: {engine[0]?.valves ?? "N/A"}</p>
              <p>Valve Timing: {engine[0]?.valve_timing ?? "N/A"}</p>
              <p>Cam Type: {engine[0]?.cam_type ?? "N/A"}</p>
              <p>Drive Type: {engine[0]?.drive_type ?? "N/A"}</p>
              <p>Transmission: {engine[0]?.transmission ?? "N/A"}</p>
            </>
          ) : (
            <p>No engine details available</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderComparisonCharts = () => {
    if (!engine1 || !engine2 || !trims1 || !trims2) return null;

    const trim1 = trims1.find((trim) => trim.id === carSelections[0].trimId);
    const trim2 = trims2.find((trim) => trim.id === carSelections[1].trimId);

    if (!trim1 || !trim2) return null;

    const engineData = [
      {
        name: "Horsepower",
        Car1: engine1[0]?.horsepower_hp,
        Car2: engine2[0]?.horsepower_hp,
      },
      {
        name: "Torque",
        Car1: engine1[0]?.torque_ft_lbs,
        Car2: engine2[0]?.torque_ft_lbs,
      },
    ];

    const priceData = [
      { name: "MSRP", Car1: trim1.msrp, Car2: trim2.msrp },
      { name: "Invoice", Car1: trim1.invoice, Car2: trim2.invoice },
    ];

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Comparison Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-xl font-semibold">Engine Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Car1" fill="#8884d8" />
              <Bar dataKey="Car2" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          <h3 className="mb-4 mt-8 text-xl font-semibold">Price Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Car1" fill="#8884d8" />
              <Bar dataKey="Car2" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
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

            {renderCarSelector(0)}
            {renderCarSelector(1)}

            <div className="m d:grid-cols-2 grid grid-cols-1 gap-8">
              {renderCarDetails(0)}
              {renderCarDetails(1)}
            </div>

            {carSelections[0].trimId &&
              carSelections[1].trimId &&
              renderComparisonCharts()}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
