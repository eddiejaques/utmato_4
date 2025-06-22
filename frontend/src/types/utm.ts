import { UUID } from "crypto";

export interface URLValidationRequest {
    url: string;
}

export interface URLValidationResponse {
    is_valid: boolean;
    message: string;
    validated_url?: string;
}

export interface UTMLinkBase {
    destination_url: string;
    utm_source: string;
    utm_medium: string;
    utm_term?: string;
    utm_content?: string;
}

export interface UTMLinkCreate extends UTMLinkBase {
    campaign_id: UUID;
}

export interface UTMLink extends UTMLinkBase {
    id: UUID;
    campaign_id: UUID;
    utm_campaign: string;
    generated_url: string;
    click_count: number;
    created_at: string;
} 