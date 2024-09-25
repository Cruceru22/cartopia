import axios from 'axios';

const API_BASE_URL = 'https://carapi.app/api';

interface CarMake {
  id: number;
  name: string;
}

interface CarMakeResponse {
  data: CarMake[]
}

interface CarModel {
  id: number;
  make_id: number;
  name: string;
  year: number;
}

interface CarModelResponse {
  data: CarModel[]
}

interface CarTrim {
  id: number;
  model_id: number;
  name: string;
  year: number;
  msrp: number;
  invoice: number;
}

async function getJWT(apiToken: string, apiSecret: string): Promise<string> {
  const response = await axios.post<{ token: string }>(`${API_BASE_URL}/auth/login`, {
    api_token: apiToken,
    api_secret: apiSecret
  });

  return response.data.token;
}

async function apiGet<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const token = await getJWT(process.env.CAR_API_TOKEN!, process.env.CAR_API_SECRET!);
  const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    params
  });
  return response.data;
}

export async function getCarMakes(): Promise<CarMakeResponse> {
  return apiGet<CarMakeResponse>('/makes');
}

export async function getCarModels(makeId: number, year: number): Promise<CarModelResponse> {
  const params: Record<string, string | number> = { make_id: makeId, verbose: 'yes', year: year };
  return apiGet<CarModelResponse>('/models', params);
}

export async function getCarTrims(modelId: number, year: number): Promise<CarTrim[]> {
  return apiGet<CarTrim[]>('/trims', { model_id: modelId, year });
}

export async function getCarDetails(trimId: number): Promise<CarTrim> {
  return apiGet<CarTrim>(`/trims/${trimId}`);
}