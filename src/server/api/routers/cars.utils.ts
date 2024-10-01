import axios from "axios";

const API_BASE_URL = "https://carapi.app/api";

interface CarMake {
  id: number;
  name: string;
}
interface CarMakeResponse {
  data: CarMake[];
}

interface CarModel {
  id: number;
  make_id: number;
  name: string;
  year: number;
}
interface CarModelResponse {
  data: CarModel[];
}

interface CarTrim {
  id: number;
  make_model_id: number;
  year: number;
  name: string;
  description: string;
  msrp: number;
  invoice: number;
  created: Date;
  modified: Date;
}

interface CarTrimResponse {
  data: CarTrim[];
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

interface EngineResponse {
  data: Engine[];
}

async function getJWT(apiToken: string, apiSecret: string): Promise<string> {
  const response = await axios.post<string>(`${API_BASE_URL}/auth/login`, {
    api_token: apiToken,
    api_secret: apiSecret,
  });

  const JWT_TOKEN = response.data;
  return JWT_TOKEN;
}

async function apiGet<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const token = await getJWT(
    process.env.CAR_API_TOKEN ?? '',
    process.env.CAR_API_SECRET ?? '',
  );
  const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    params,
  });
  return response.data;
}

export async function getCarMakes(): Promise<CarMakeResponse> {
  return apiGet<CarMakeResponse>("/makes");
}

export async function getCarModels(
  makeId: number,
  year: number,
): Promise<CarModelResponse> {
  const params: Record<string, string | number> = {
    make_id: makeId,
    verbose: "yes",
    year: year,
  };
  return apiGet<CarModelResponse>("/models", params);
}

export async function getCarTrims(
  model_id: number,
  year: number,
  make_id: number,
): Promise<CarTrimResponse> {
  const params: Record<string, string | number> = {
    model_id: model_id,
    year: year,
    verbose: "yes",
    make_id: make_id,
  };
  try {
    const response = await apiGet<CarTrimResponse>("/trims", params);
    const filteredTrims = response.data.filter(
      (trim) => trim.make_model_id === model_id,
    );
    return { data: filteredTrims };
  } catch (error) {
    throw error;
  }
}

export async function getEngineDetails(trimId: number): Promise<EngineResponse> {
  try {
    const response = await apiGet<EngineResponse>(`/engines?make_model_trim_id=${trimId}`);

    if (response.data.length === 0) {
      console.warn(`No engine details found for trimId: ${trimId}`);
    } else if (response.data.length > 1) {
      console.warn(`Multiple engine details found for trimId: ${trimId}`);
    }
    return response;
  } catch (error) {
    console.error(`Error fetching engine details for trimId: ${trimId}`, error);
    throw error;
  }
}