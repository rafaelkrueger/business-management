import http from './http-business.ts';

// Types
export interface CreateAdvertisementData {
  companyId: string;
  platform: 'GOOGLE' | 'FACEBOOK' | 'TIKTOK' | 'INSTAGRAM' | 'TWITTER';
  name: string;
  description?: string;
  mediaUrl?: string;
  budget?: number;
  dailyBudget?: number;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  objective?: string;
  creativeType?: string;
  targeting?: {
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      genders?: string[];
      locations?: string[];
      languages?: string[];
      education?: string[];
      income?: string[];
    };
    interests?: {
      categories?: string[];
      keywords?: string[];
      behaviors?: string[];
      topics?: string[];
    };
    customAudiences?: {
      lookalikeAudiences?: string[];
      customLists?: string[];
      websiteVisitors?: boolean;
      emailSubscribers?: boolean;
      appUsers?: boolean;
    };
    placements?: {
      platforms?: string[];
      devices?: string[];
      positions?: string[];
      websites?: string[];
      apps?: string[];
    };
    bidAmount?: number;
    bidStrategy?: string;
    targetCpa?: number;
    targetRoas?: number;
  };
  adCreative?: {
    headline?: string;
    description?: string;
    callToAction?: string;
    primaryText?: string;
    secondaryText?: string;
    displayUrl?: string;
    finalUrl?: string;
    trackingTemplate?: string;
  };
  settings?: {
    autoOptimization?: boolean;
    frequencyCapping?: {
      enabled?: boolean;
      impressions?: number;
      period?: string;
    };
    scheduling?: {
      enabled?: boolean;
      timeSlots?: Array<{
        day: string;
        startTime: string;
        endTime: string;
      }>;
    };
    geoTargeting?: {
      countries?: string[];
      states?: string[];
      cities?: string[];
      radius?: number;
    };
  };
  mediaAssets?: {
    images?: string[];
    videos?: string[];
    thumbnails?: string[];
    descriptions?: string[];
  };
}

export interface UpdateAdvertisementData extends CreateAdvertisementData {
  status?: string;
  rejectionReason?: string;
}

export interface ConnectAccountData {
  companyId: string;
  platform: 'GOOGLE' | 'FACEBOOK' | 'TIKTOK' | 'INSTAGRAM' | 'TWITTER';
  accessToken: string;
  refreshToken?: string;
  tokenExpiration?: string;
  accountName?: string;
  accountId?: string;
  currency?: string;
  timezone?: string;
  spendLimit?: number;
  permissions?: {
    canCreateCampaigns?: boolean;
    canEditCampaigns?: boolean;
    canViewReports?: boolean;
    canManageBilling?: boolean;
    canManageUsers?: boolean;
  };
  settings?: {
    autoSync?: boolean;
    syncInterval?: number;
    notifications?: {
      email?: boolean;
      push?: boolean;
      webhook?: string;
    };
  };
}

export interface UpdateAccountData {
  accountName?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiration?: string;
  status?: string;
  currency?: string;
  timezone?: string;
  spendLimit?: number;
  permissions?: {
    canCreateCampaigns?: boolean;
    canEditCampaigns?: boolean;
    canViewReports?: boolean;
    canManageBilling?: boolean;
    canManageUsers?: boolean;
  };
  settings?: {
    autoSync?: boolean;
    syncInterval?: number;
    notifications?: {
      email?: boolean;
      push?: boolean;
      webhook?: string;
    };
  };
}

export interface CreateMetricsData {
  advertisementId: string;
  impressions: number;
  clicks: number;
  spent: number;
  conversions?: number;
  reach?: number;
  videoViews?: number;
  shares?: number;
  comments?: number;
  likes?: number;
  date: string;
  breakdown?: Record<string, any>;
  customMetrics?: Record<string, any>;
}

export interface GetMetricsData {
  advertisementId: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
  metrics?: string[];
}

export interface PerformanceSummaryData {
  companyId: string;
  startDate?: string;
  endDate?: string;
  platforms?: string[];
}

export interface PlatformPerformanceData {
  companyId: string;
  startDate?: string;
  endDate?: string;
}

export interface CampaignFilters {
  platform?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class AdsService {
  // Basic CRUD operations
  static create(data: CreateAdvertisementData) {
    return http.post(`/advertisements`, data);
  }

  static getAll(companyId: string, filters?: CampaignFilters) {
    const params = new URLSearchParams();
    params.append('companyId', companyId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return http.get(`/advertisements?${params.toString()}`);
  }

  static get(id: string) {
    return http.get(`/advertisements/${id}`);
  }

  static update(id: string, data: UpdateAdvertisementData) {
    return http.put(`/advertisements/${id}`, data);
  }

  static remove(id: string) {
    return http.delete(`/advertisements/${id}`);
  }

  static toggleStatus(id: string) {
    return http.post(`/advertisements/${id}/toggle-status`);
  }

  // Account management
  static connectAccount(data: ConnectAccountData) {
    return http.post(`/advertisements/accounts`, data);
  }

  static listAccounts(companyId: string) {
    return http.get(`/advertisements/accounts?companyId=${companyId}`);
  }

  static getAccount(id: string) {
    return http.get(`/advertisements/accounts/${id}`);
  }

  static updateAccount(id: string, data: UpdateAccountData) {
    return http.put(`/advertisements/accounts/${id}`, data);
  }

  static disconnectAccount(id: string) {
    return http.delete(`/advertisements/accounts/${id}`);
  }

  static testConnection(platform: string, credentials: any) {
    return http.post(`/advertisements/accounts/test-connection`, {
      platform,
      credentials
    });
  }

  // Metrics management
  static createMetrics(data: CreateMetricsData) {
    return http.post(`/advertisements/metrics`, data);
  }

  static getMetrics(data: GetMetricsData) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    return http.get(`/advertisements/metrics?${params.toString()}`);
  }

  // Performance and analytics
  static getPerformanceSummary(data: PerformanceSummaryData) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    return http.get(`/advertisements/performance/summary?${params.toString()}`);
  }

  static getPlatformPerformance(data: PlatformPerformanceData) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return http.get(`/advertisements/performance/platforms?${params.toString()}`);
  }

  // Analytics and reports
  static getAnalyticsOverview(companyId: string) {
    return http.get(`/advertisements/analytics/overview?companyId=${companyId}`);
  }

  static getPerformanceTrends(
    companyId: string,
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    const params = new URLSearchParams({
      companyId,
      startDate,
      endDate,
      groupBy
    });
    return http.get(`/advertisements/analytics/trends?${params.toString()}`);
  }

  static getPerformanceBreakdown(
    companyId: string,
    breakdownBy: 'platform' | 'campaign' | 'audience' | 'placement',
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({
      companyId,
      breakdownBy
    });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return http.get(`/advertisements/analytics/breakdown?${params.toString()}`);
  }

  // Recommendations
  static getRecommendations(companyId: string) {
    return http.get(`/advertisements/recommendations?companyId=${companyId}`);
  }

  // Sync operations
  static sync(id: string) {
    return http.post(`/advertisements/${id}/sync`);
  }

  static syncAll(companyId: string) {
    return http.post(`/advertisements/sync/all?companyId=${companyId}`);
  }

  // Export functionality
  static exportCampaigns(
    companyId: string,
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({
      companyId,
      format
    });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return http.get(`/advertisements/export/campaigns?${params.toString()}`);
  }

  static exportMetrics(
    companyId: string,
    campaignId?: string,
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({
      companyId,
      format
    });
    if (campaignId) params.append('campaignId', campaignId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return http.get(`/advertisements/export/metrics?${params.toString()}`);
  }

  // OAuth 2.0 Methods
  static async getGoogleOAuthUrl() {
    const response = await http.get('/advertisements/oauth/google/url');
    return response.data;
  }

  static async getFacebookOAuthUrl() {
    const response = await http.get('/advertisements/oauth/facebook/url');
    return response.data;
  }

  static async getTikTokOAuthUrl() {
    const response = await http.get('/advertisements/oauth/tiktok/url');
    return response.data;
  }

  static async getTwitterOAuthUrl() {
    const response = await http.get('/advertisements/oauth/twitter/url');
    return response.data;
  }

  static async handleOAuthCallback(platform: string, code: string, state?: string) {
    const response = await http.get(`/advertisements/oauth/${platform}/callback`, {
      params: { code, state }
    });
    return response.data;
  }

  // Utility methods
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  static calculateCTR(clicks: number, impressions: number): number {
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  }

  static calculateCPC(spent: number, clicks: number): number {
    return clicks > 0 ? spent / clicks : 0;
  }

  static calculateCPM(spent: number, impressions: number): number {
    return impressions > 0 ? (spent / impressions) * 1000 : 0;
  }

  static calculateROAS(revenue: number, spent: number): number {
    return spent > 0 ? revenue / spent : 0;
  }

  static getPlatformIcon(platform: string) {
    const icons = {
      google: '🔵',
      facebook: '🔵',
      tiktok: '⚫',
      instagram: '🟣',
      x: '⚫',
      twitter: '🔵'
    };
    return icons[platform.toLowerCase()] || '📱';
  }

  static getStatusColor(status: string) {
    const colors = {
      active: 'success',
      running: 'success',
      paused: 'warning',
      completed: 'default',
      draft: 'secondary',
      rejected: 'error',
      pending_review: 'info'
    };
    return colors[status.toLowerCase()] || 'default';
  }

  static getObjectiveOptions() {
    return [
      { value: 'AWARENESS', label: 'Brand Awareness' },
      { value: 'CONSIDERATION', label: 'Consideration' },
      { value: 'CONVERSION', label: 'Conversions' },
      { value: 'TRAFFIC', label: 'Website Traffic' },
      { value: 'ENGAGEMENT', label: 'Engagement' },
      { value: 'APP_INSTALLS', label: 'App Installs' },
      { value: 'VIDEO_VIEWS', label: 'Video Views' },
      { value: 'LEAD_GENERATION', label: 'Lead Generation' }
    ];
  }

  static getCreativeTypeOptions() {
    return [
      { value: 'IMAGE', label: 'Image' },
      { value: 'VIDEO', label: 'Video' },
      { value: 'CAROUSEL', label: 'Carousel' },
      { value: 'STORY', label: 'Story' },
      { value: 'COLLECTION', label: 'Collection' },
      { value: 'DYNAMIC', label: 'Dynamic' }
    ];
  }

  static getBidStrategyOptions() {
    return [
      { value: 'MANUAL', label: 'Manual Bidding' },
      { value: 'AUTOMATIC', label: 'Automatic Bidding' },
      { value: 'TARGET_CPA', label: 'Target CPA' },
      { value: 'TARGET_ROAS', label: 'Target ROAS' },
      { value: 'MAXIMIZE_CLICKS', label: 'Maximize Clicks' },
      { value: 'MAXIMIZE_CONVERSIONS', label: 'Maximize Conversions' }
    ];
  }

  static getPlatformOptions() {
    return [
      { value: 'GOOGLE', label: 'Google Ads', icon: '🔵' },
      { value: 'FACEBOOK', label: 'Facebook Ads', icon: '🔵' },
      { value: 'INSTAGRAM', label: 'Instagram Ads', icon: '🟣' },
      { value: 'TIKTOK', label: 'TikTok Ads', icon: '⚫' },
      { value: 'TWITTER', label: 'Twitter/X Ads', icon: '⚫' }
    ];
  }

  static getStatusOptions() {
    return [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'ACTIVE', label: 'Active' },
      { value: 'PAUSED', label: 'Paused' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'PENDING_REVIEW', label: 'Pending Review' }
    ];
  }

  static getCallToActionOptions() {
    return [
      { value: 'SHOP_NOW', label: 'Shop Now' },
      { value: 'LEARN_MORE', label: 'Learn More' },
      { value: 'SIGN_UP', label: 'Sign Up' },
      { value: 'DOWNLOAD', label: 'Download' },
      { value: 'CONTACT_US', label: 'Contact Us' },
      { value: 'GET_QUOTE', label: 'Get Quote' },
      { value: 'APPLY_NOW', label: 'Apply Now' },
      { value: 'BOOK_NOW', label: 'Book Now' }
    ];
  }

  static getDemographicsOptions() {
    return {
      ageRanges: [
        { value: '18-24', label: '18-24' },
        { value: '25-34', label: '25-34' },
        { value: '35-44', label: '35-44' },
        { value: '45-54', label: '45-54' },
        { value: '55-64', label: '55-64' },
        { value: '65+', label: '65+' }
      ],
      genders: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'all', label: 'All' }
      ],
      education: [
        { value: 'high_school', label: 'High School' },
        { value: 'some_college', label: 'Some College' },
        { value: 'bachelors', label: 'Bachelor\'s Degree' },
        { value: 'masters', label: 'Master\'s Degree' },
        { value: 'doctorate', label: 'Doctorate' }
      ],
      income: [
        { value: 'low', label: 'Low Income' },
        { value: 'medium', label: 'Medium Income' },
        { value: 'high', label: 'High Income' }
      ]
    };
  }

  static getDeviceOptions() {
    return [
      { value: 'desktop', label: 'Desktop' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'tablet', label: 'Tablet' }
    ];
  }

  static getPlacementOptions() {
    return [
      { value: 'feed', label: 'News Feed' },
      { value: 'stories', label: 'Stories' },
      { value: 'reels', label: 'Reels' },
      { value: 'search', label: 'Search Results' },
      { value: 'display', label: 'Display Network' },
      { value: 'video', label: 'Video' }
    ];
  }

  // Validation helpers
  static validateCampaignData(data: CreateAdvertisementData): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Campaign name is required');
    }

    if (!data.platform) {
      errors.push('Platform is required');
    }

    if (data.budget && data.budget <= 0) {
      errors.push('Budget must be greater than 0');
    }

    if (data.dailyBudget && data.dailyBudget <= 0) {
      errors.push('Daily budget must be greater than 0');
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        errors.push('End date must be after start date');
      }
    }

    return errors;
  }

  static validateAccountData(data: ConnectAccountData): string[] {
    const errors: string[] = [];

    if (!data.platform) {
      errors.push('Platform is required');
    }

    if (!data.accessToken || data.accessToken.trim().length === 0) {
      errors.push('Access token is required');
    }

    if (data.spendLimit && data.spendLimit <= 0) {
      errors.push('Spend limit must be greater than 0');
    }

    return errors;
  }
}

export default AdsService;

