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

export interface OfficeMaster {
    id?: number;
    name: string;
    country: number;
    country_name?: string;
    address: string;
    contact: string;
    email: string;
}

export interface UserTypeMaster {
    id?: number;
    name: string;
    description: string;
}

export interface DocumentTypeMaster {
    id?: number;
    name: string;
    description: string;
}

export interface DocumentRequirement {
    id?: number;
    user_type: number;
    user_type_name?: string;
    country: number;
    country_name?: string;
    office: number;
    office_name?: string;
    document_type: number;
    document_type_name?: string;
    is_mandatory: boolean;
}

export interface UserDocument {
    id?: number;
    user_detail: number;
    document_requirement: number;
    document_type_name?: string;
    is_mandatory?: boolean;
    document_value?: string;
    file_upload: string;
    is_active: boolean;
    uploaded_at: string;
    verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    verification_method?: 'MANUAL' | 'PORTAL';
    is_verified: boolean;
    verified_at?: string;
}

export interface UserDetail {
    id?: number;
    name: string;
    country: number;
    country_name?: string;
    office: number;
    office_name?: string;
    user_type: number;
    user_type_name?: string;
    status: string;
    state?: string;
    city?: string;
    remarks?: string;
    person1_name: string;
    person1_phone: string;
    person2_name?: string;
    person2_phone?: string;
    full_address: string;
    bank_name?: string;
    account_holder_name?: string;
    account_number?: string;
    ifsc_swift?: string;
    documents?: UserDocument[];
    kyc_summary?: {
        required: number;
        accepted: number;
        rejected: number;
        pending: number;
    };
}


