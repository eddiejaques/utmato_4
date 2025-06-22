export enum CampaignStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED',
  }
  
  export interface Campaign {
    id: string;
    company_id: string;
    name: string;
    status: CampaignStatus;
    budget_info?: Record<string, any>;
    created_at: string;
    updated_at?: string;
  }
  
  export interface CampaignCreate {
    name: string;
    status?: CampaignStatus;
    budget_info?: Record<string, any>;
  }
  
  export interface CampaignUpdate {
    name?: string;
    status?: CampaignStatus;
    budget_info?: Record<string, any>;
  } 