import axios, { AxiosError, AxiosInstance } from 'axios';
import type { 
  IP, CreateIPRequest, 
  IngestRequest, IngestResponse, IngestStatus,
  RetrieveRequest, RetrieveResult,
  MemoryFullConfig 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // IP APIs
  async createIP(data: CreateIPRequest): Promise<IP> {
    const response = await this.client.post<IP>('/ip', data);
    return response.data;
  }

  async getIP(ipId: string): Promise<IP> {
    const response = await this.client.get<IP>(`/ip/${ipId}`);
    return response.data;
  }

  // Memory APIs
  async ingestMemory(data: IngestRequest): Promise<IngestResponse> {
    const response = await this.client.post<IngestResponse>('/memory/ingest', data);
    return response.data;
  }

  async getIngestStatus(taskId: string): Promise<IngestStatus> {
    const response = await this.client.get<IngestStatus>(`/memory/ingest/${taskId}`);
    return response.data;
  }

  async retrieveMemory(data: RetrieveRequest): Promise<RetrieveResult[]> {
    const response = await this.client.post<{ results: RetrieveResult[] }>('/memory/retrieve', data);
    return response.data.results;
  }

  // Config APIs
  async getMemoryConfig(ipId: string): Promise<MemoryFullConfig> {
    const response = await this.client.get<MemoryFullConfig>('/config/memory', {
      params: { ip_id: ipId },
    });
    return response.data;
  }

  async saveMemoryConfig(data: MemoryFullConfig): Promise<{ success: boolean; version: number }> {
    const response = await this.client.post<{ success: boolean; version: number }>('/config/memory', data);
    return response.data;
  }
}

export const api = new ApiClient();
