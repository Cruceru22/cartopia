"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
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
    { trimId: carSelections[0].trimId ?? 0 },
    { enabled: carSelections[0].trimId !== null },
  );
  const { data: trims1 } = api.cars.trims.useQuery(
    {
      modelId: carSelections[0].modelId ?? 0,
      year: carSelections[0].year ?? 0,
      make_id: carSelections[0].makeId ?? 0,
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
    { trimId: carSelections[1].trimId ?? 0 },
    { enabled: carSelections[1].trimId !== null },
  );
  const { data: trims2 } = api.cars.trims.useQuery(
    {
      modelId: carSelections[1].modelId ?? 0,
      year: carSelections[1].year ?? 0,
      make_id: carSelections[1].makeId ?? 0,
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
    if (!selection) return null;
  
    const { data: models, isLoading: isLoadingModels } =
      api.cars.models.useQuery(
        { make_id: selection.makeId ?? 0, year: selection.year ?? 0 },
        { enabled: selection.makeId !== null && selection.year !== null },
      );
    const { data: trims, isLoading: isLoadingTrims } = api.cars.trims.useQuery(
      {
        modelId: selection.modelId ?? 0,
        year: selection.year ?? 0,
        make_id: selection.makeId ?? 0,
      },
      { enabled: selection.modelId !== null && selection.year !== null },
    );
  
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Car {index + 1}
          </CardTitle>
          <CardDescription>Select your car details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Select
              onValueChange={(value) =>
                handleSelectionChange(index, "makeId", Number(value))
              }
              value={selection.makeId?.toString()}
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
              onValueChange={(value) =>
                handleSelectionChange(index, "year", Number(value))
              }
              value={selection.year?.toString()}
              disabled={selection.makeId === null}
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
              onValueChange={(value) =>
                handleSelectionChange(index, "modelId", Number(value))
              }
              value={selection.modelId?.toString()}
              disabled={selection.makeId === null || selection.year === null}
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
              onValueChange={(value) =>
                handleSelectionChange(index, "trimId", Number(value))
              }
              value={selection.trimId?.toString()}
              disabled={selection.modelId === null}
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
        </CardContent>
      </Card>
    );
  };
  
  const renderCarDetails = (index: number) => {
    const selection = carSelections[index];
    if (!selection) return null;
  
    const { data: engine, isLoading: isLoadingEngineDetails } =
      api.cars.engine.useQuery<Engine[]>(
        { trimId: selection.trimId ?? 0 },
        { enabled: selection.trimId !== null },
      );
    const { data: trims } = api.cars.trims.useQuery(
      {
        modelId: selection.modelId ?? 0,
        year: selection.year ?? 0,
        make_id: selection.makeId ?? 0,
      },
      { enabled: selection.modelId !== null && selection.year !== null },
    );
    const { data: models } = api.cars.models.useQuery(
      { make_id: selection.makeId ?? 0, year: selection.year ?? 0 },
      { enabled: selection.makeId !== null && selection.year !== null },
    );
  
    if (selection.trimId === null) return null;
  
    const selectedModel = models?.find(
      (model) => model.id === selection.modelId,
    );
    const selectedTrim = trims?.find((trim) => trim.id === selection.trimId);
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Car {index + 1} Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Basic Info</h3>
              <p>Make: {makes?.find((make) => make.id === selection.makeId)?.name}</p>
              <p>Year: {selection.year}</p>
              <p>Model: {selectedModel?.name}</p>
              <p>Trim: {selectedTrim?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Pricing</h3>
              <p>MSRP: ${selectedTrim?.msrp.toLocaleString()}</p>
              <p>Invoice: ${selectedTrim?.invoice.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Description</h3>
            <p>{selectedTrim?.description}</p>
          </div>
          {isLoadingEngineDetails ? (
            <p>Loading engine details...</p>
          ) : engine ? (
            <div className="mt-4">
              <h3 className="font-semibold">Engine Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Engine Type: {engine[0]?.engine_type ?? "N/A"}</p>
                  <p>Fuel Type: {engine[0]?.fuel_type ?? "N/A"}</p>
                  <p>Cylinders: {engine[0]?.cylinders ?? "N/A"}</p>
                  <p>Size: {engine[0]?.size ?? "N/A"}</p>
                  <p>Valves: {engine[0]?.valves ?? "N/A"}</p>
                </div>
                <div>
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
                  <p>Valve Timing: {engine[0]?.valve_timing ?? "N/A"}</p>
                  <p>Cam Type: {engine[0]?.cam_type ?? "N/A"}</p>
                  <p>Drive Type: {engine[0]?.drive_type ?? "N/A"}</p>
                  <p>Transmission: {engine[0]?.transmission ?? "N/A"}</p>
                </div>
              </div>
            </div>
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
        attribute: "Horsepower",
        Car1: engine1[0]?.horsepower_hp ?? 0,
        Car2: engine2[0]?.horsepower_hp ?? 0,
      },
      {
        attribute: "Torque",
        Car1: engine1[0]?.torque_ft_lbs ?? 0,
        Car2: engine2[0]?.torque_ft_lbs ?? 0,
      },
      {
        attribute: "Engine Size",
        Car1: parseFloat(engine1[0]?.size ?? "0"),
        Car2: parseFloat(engine2[0]?.size ?? "0"),
      },
      {
        attribute: "Cylinders",
        Car1: parseInt(engine1[0]?.cylinders ?? "0", 10),
        Car2: parseInt(engine2[0]?.cylinders ?? "0", 10),
      },
    ];
  
    const priceData = [
      { name: "MSRP", Car1: trim1.msrp, Car2: trim2.msrp },
      { name: "Invoice", Car1: trim1.invoice, Car2: trim2.invoice },
    ];
  
    const valveData = [
        { name: "Car 1", value: engine1[0]?.valves ?? 0 },
        { name: "Car 2", value: engine2[0]?.valves ?? 0 },
      ];
    
      const engineSizeData = [
        { name: "Car 1", value: parseFloat(engine1[0]?.size ?? "0") },
        { name: "Car 2", value: parseFloat(engine2[0]?.size ?? "0") },
      ];
    
      const COLORS = ["#8884d8", "#82ca9d"];
    
      return (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Comparison Charts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Engine Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={engineData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar name="Car 1" dataKey="Car1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Car 2" dataKey="Car2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold">Price Comparison</h3>
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
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold">Valve Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={valveData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {valveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold">Engine Size Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engineSizeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
                
                <h1 className="flex text-3xl font-bold text-blue-600 justify-center">
                  <Car className="mr-2" size={32} />
                  Cartopia Comparison
                </h1>
              </motion.div>
  
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {renderCarSelector(0)}
                {renderCarSelector(1)}
              </div>
  
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {renderCarDetails(0)}
                {renderCarDetails(1)}
              </div>
  
              {carSelections[0].trimId !== null &&
                carSelections[1].trimId !== null &&
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