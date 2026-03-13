export type KycStatus = 'Approval Pending' | 'KYC Pending' | 'KYC Expired' | 'KYC Rejected' | 'Inactive' | 'Verified';

export interface KycSummary {
    required: number;
    accepted: number;
    rejected: number;
    expired: number;
}

export interface Customer {
    id: string;
    name: string;
    country: string;
    phone: string;
    email: string;
    status: KycStatus;
    kycSummary: KycSummary;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    status: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
    uploadDate?: string;
}

export interface CountryMaster {
    id?: number;
    name: string;
    code_2?: string;
    code_3?: string;
    dial_code: string;
}

