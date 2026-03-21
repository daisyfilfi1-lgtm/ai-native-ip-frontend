import axios, { AxiosError, AxiosInstance } from 'axios';

import { getBrowserApiBaseUrl } from '@/lib/apiBaseUrl';
import type { 
  IP, CreateIPRequest, 
  IngestRequest, IngestResponse, IngestStatus, MemoryUploadResponse,
  AssetsListResponse,
  RetrieveRequest, RetrieveResult,
  MemoryFullConfig,
  FeishuConfig, FeishuConfigSave, FeishuSpaceItem, FeishuSyncResult, FeishuBinding,
  PendingLabelsItem,
  UpdateLabelsRequest,
  ConfigHistoryItem,
  // 新增类型
  HybridRetrieveRequest, HybridRetrieveResult,
  GraphBuildRequest, GraphBuildResult,
  GraphRetrieveRequest, GraphRetrieveResult,
  GraphStatsResult,
  MemoryConsolidateResult,
  MemorySummaryResult,
  CoreMemoryResult,
  TimeWeightedRequest, TimeWeightedResult,
  VideoAnalyzeResult,
  ImageAnalyzeResult,
  AudioTopicsResult,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use((config) => {
      config.baseURL = getBrowserApiBaseUrl();
      return config;
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
    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.client.post<IngestResponse>('/memory/ingest', data);
        return response.data;
      } catch (err) {
        const ax = err as AxiosError;
        const status = ax.response?.status;
        const retryable =
          status === 502 ||
          status === 503 ||
          status === 504 ||
          ax.code === 'ECONNABORTED' ||
          ax.code === 'ERR_NETWORK';
        if (retryable && attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }
    throw new Error('ingestMemory failed');
  }

  /** 上传素材文件，返回 file_id 供 ingest 传入 local_file_id。对网关 502/503/504 与网络错误重试，与轮询 ingest 一致。 */
  async uploadMemoryFile(ipId: string, file: File): Promise<MemoryUploadResponse> {
    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const formData = new FormData();
        formData.append('ip_id', ipId);
        formData.append('file', file);
        const response = await this.client.post<MemoryUploadResponse>('/memory/upload', formData, {
          timeout: 120000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          transformRequest: [
            (data, headers) => {
              if (data instanceof FormData) {
                delete headers['Content-Type'];
              }
              return data;
            },
          ],
        });
        return response.data;
      } catch (err) {
        const ax = err as AxiosError;
        const status = ax.response?.status;
        const retryable =
          status === 502 ||
          status === 503 ||
          status === 504 ||
          ax.code === 'ECONNABORTED' ||
          ax.code === 'ERR_NETWORK';
        if (retryable && attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 600 + attempt * 400));
          continue;
        }
        throw err;
      }
    }
    throw new Error('uploadMemoryFile failed');
  }

  /**
   * 轮询任务状态。对 502/503/504（网关/部署瞬时故障）自动重试，减轻 Netlify→Railway 代理抖动。
   */
  async getIngestStatus(taskId: string): Promise<IngestStatus> {
    const maxAttempts = 8;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.client.get<IngestStatus>(`/memory/ingest/${taskId}`);
        return response.data;
      } catch (err) {
        const ax = err as AxiosError;
        const status = ax.response?.status;
        const retryable =
          status === 502 ||
          status === 503 ||
          status === 504 ||
          ax.code === 'ECONNABORTED' ||
          ax.code === 'ERR_NETWORK';
        if (retryable && attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 600 + attempt * 350));
          continue;
        }
        throw err;
      }
    }
    throw new Error('getIngestStatus failed');
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

  async getFeishuBinding(ipId: string): Promise<FeishuBinding | null> {
    const response = await this.client.get<FeishuBinding | null>('/integrations/feishu/binding', {
      params: { ip_id: ipId },
    });
    return response.data;
  }

  async saveFeishuBinding(ipId: string, spaceId: string, spaceName?: string): Promise<FeishuBinding> {
    const response = await this.client.post<FeishuBinding>('/integrations/feishu/binding', {
      ip_id: ipId,
      space_id: spaceId,
      space_name: spaceName || undefined,
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

  // ==================== 混合检索 ====================
  async hybridRetrieve(data: HybridRetrieveRequest): Promise<HybridRetrieveResult> {
    const response = await this.client.post<HybridRetrieveResult>('/memory/retrieve/hybrid', data);
    return response.data;
  }

  // ==================== 记忆Consolidation ====================
  async consolidateMemory(ipId: string): Promise<MemoryConsolidateResult> {
    const response = await this.client.post<MemoryConsolidateResult>('/memory/consolidate', null, {
      params: { ip_id: ipId },
    });
    return response.data;
  }

  async getMemorySummary(ipId: string): Promise<MemorySummaryResult> {
    const response = await this.client.get<MemorySummaryResult>('/memory/summary', {
      params: { ip_id: ipId },
    });
    return response.data;
  }

  async getCoreMemory(ipId: string, limit = 10): Promise<CoreMemoryResult> {
    const response = await this.client.get<CoreMemoryResult>('/memory/core', {
      params: { ip_id: ipId, limit },
    });
    return response.data;
  }

  async getArchivedMemory(ipId: string, limit = 20): Promise<CoreMemoryResult> {
    const response = await this.client.get<CoreMemoryResult>('/memory/archived', {
      params: { ip_id: ipId, limit },
    });
    return response.data;
  }

  async restoreFromArchive(ipId: string, assetId: string): Promise<{ success: boolean }> {
    const response = await this.client.post<{ success: boolean }>('/memory/restore', {
      ip_id: ipId,
      asset_id: assetId,
    });
    return response.data;
  }

  async timeWeightedRetrieve(data: TimeWeightedRequest): Promise<TimeWeightedResult> {
    const response = await this.client.post<TimeWeightedResult>('/memory/retrieve/time-weighted', data);
    return response.data;
  }

  // ==================== Graph RAG ====================
  async buildGraph(data: GraphBuildRequest): Promise<GraphBuildResult> {
    const response = await this.client.post<GraphBuildResult>('/graph/build', data);
    return response.data;
  }

  async retrieveGraph(data: GraphRetrieveRequest): Promise<GraphRetrieveResult> {
    const response = await this.client.post<GraphRetrieveResult>('/graph/retrieve', data);
    return response.data;
  }

  async getGraphStats(ipId: string): Promise<GraphStatsResult> {
    const response = await this.client.get<GraphStatsResult>(`/graph/stats/${ipId}`);
    return response.data;
  }

  async deleteGraph(ipId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(`/graph/${ipId}`);
    return response.data;
  }

  // ==================== 向量检索 ====================
  async vectorSearch(ipId: string, query: string, topK = 10): Promise<any> {
    const response = await this.client.post('/vector/search', {
      ip_id: ipId,
      query,
      top_k: topK,
      use_hybrid: true,
    });
    return response.data;
  }

  async getCollectionInfo(ipId: string): Promise<any> {
    const response = await this.client.get(`/vector/collection/${ipId}`);
    return response.data;
  }

  // ==================== 多模态 ====================
  async analyzeVideo(videoUrl: string, prompt?: string): Promise<VideoAnalyzeResult> {
    const response = await this.client.post<VideoAnalyzeResult>('/multimodal/video/analyze', {
      video_url: videoUrl,
      prompt,
    });
    return response.data;
  }

  async analyzeImage(imageUrl: string, prompt?: string): Promise<ImageAnalyzeResult> {
    const response = await this.client.post<ImageAnalyzeResult>('/multimodal/image/analyze', {
      image_url: imageUrl,
      prompt,
    });
    return response.data;
  }

  async extractAudioTopics(audioText: string, maxTopics = 5): Promise<AudioTopicsResult> {
    const response = await this.client.post<AudioTopicsResult>('/multimodal/audio/topics', {
      audio_text: audioText,
      max_topics: maxTopics,
    });
    return response.data;
  }

  async createMultimodalAsset(data: {
    ip_id: string;
    source_type: 'video' | 'image' | 'audio';
    source_url: string;
    content?: string;
    title?: string;
  }): Promise<any> {
    const response = await this.client.post('/multimodal/asset', data);
    return response.data;
  }

  // ==================== 内容生成 APIs ====================
  content = {
    /**
     * 场景一：热点选题 + 一键生成
     */
    scenarioOne: async (
      ipId: string,
      platform: string,
      weights: {
        relevance: number;
        hotness: number;
        competition: number;
        conversion: number;
      },
      count: number = 5
    ): Promise<any[]> => {
      const response = await this.client.post('/content/scenario/one', {
        ip_id: ipId,
        platform,
        weight_relevance: weights.relevance,
        weight_hotness: weights.hotness,
        weight_competition: weights.competition,
        weight_conversion: weights.conversion,
        count,
      });
      return response.data;
    },

    /**
     * 场景二：竞品爆款改写
     */
    scenarioTwo: async (
      ipId: string,
      competitorContent: string,
      competitorPlatform?: string,
      rewriteLevel: 'light' | 'medium' | 'heavy' = 'medium'
    ): Promise<any> => {
      const response = await this.client.post('/content/scenario/two', {
        ip_id: ipId,
        competitor_content: competitorContent,
        competitor_platform: competitorPlatform,
        rewrite_level: rewriteLevel,
      });
      return response.data;
    },

    /**
     * 场景三：自定义原创
     */
    scenarioThree: async (
      ipId: string,
      topic: string,
      keyPoints?: string[],
      length: 'short' | 'medium' | 'long' = 'medium'
    ): Promise<any> => {
      const response = await this.client.post('/content/scenario/three', {
        ip_id: ipId,
        topic,
        key_points: keyPoints,
        length,
      });
      return response.data;
    },
  };
}

// Export singleton instance
export const api = new ApiClient();
export default api;
