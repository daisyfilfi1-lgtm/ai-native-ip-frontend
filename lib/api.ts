import axios, { AxiosError, AxiosInstance } from 'axios';
import type { 
  IP, CreateIPRequest, 
  IngestRequest, IngestResponse, IngestStatus,
  AssetsListResponse,
  RetrieveRequest, RetrieveResult,
  MemoryFullConfig,
  FeishuConfig, FeishuConfigSave, FeishuSpaceItem, FeishuSyncResult,
  PendingLabelsItem,
  UpdateLabelsRequest,
  ConfigHistoryItem,
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
  async listIPs(): Promise<IP[]> {
    const response = await this.client.get<IP[]>('/ip');
    return response.data;
  }

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

  async getAssets(ipId: string, limit = 20, offset = 0): Promise<AssetsListResponse> {
    const response = await this.client.get<AssetsListResponse>('/memory/assets', {
      params: { ip_id: ipId, limit, offset },
    });
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

  async getConfigHistory(ipId: string, limit = 20): Promise<{ items: ConfigHistoryItem[] }> {
    const response = await this.client.get<{ items: ConfigHistoryItem[] }>('/config/history', {
      params: { ip_id: ipId, limit },
    });
    return response.data;
  }

  // Feishu integration
  async getFeishuConfig(): Promise<FeishuConfig> {
    const response = await this.client.get<FeishuConfig>('/integrations/feishu/config');
    return response.data;
  }

  async saveFeishuConfig(data: FeishuConfigSave): Promise<{ success: boolean }> {
    const response = await this.client.post<{ success: boolean }>('/integrations/feishu/config', data);
    return response.data;
  }

  async getFeishuSpaces(): Promise<{ items: FeishuSpaceItem[] }> {
    const response = await this.client.get<{ items: FeishuSpaceItem[] }>('/integrations/feishu/spaces');
    return response.data;
  }

  async syncFeishu(ipId: string, spaceId?: string): Promise<FeishuSyncResult> {
    const response = await this.client.post<FeishuSyncResult>('/integrations/feishu/sync', {
      ip_id: ipId,
      space_id: spaceId || undefined,
    });
    return response.data;
  }

  // 待办标签
  async getPendingLabels(ipId: string, limit = 20): Promise<{ items: PendingLabelsItem[] }> {
    const response = await this.client.get<{ items: PendingLabelsItem[] }>('/memory/pending-labels', {
      params: { ip_id: ipId, limit },
    });
    return response.data;
  }

  async updateLabels(assetId: string, data: UpdateLabelsRequest): Promise<{ success: boolean }> {
    const response = await this.client.post<{ success: boolean }>(`/memory/labels/${assetId}`, data);
    return response.data;
  }
}

export const api = new ApiClient();
