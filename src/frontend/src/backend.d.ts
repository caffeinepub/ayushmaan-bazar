import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PolicyIssuanceConfirmation {
    rewardAmount: number;
    policyId: bigint;
}
export interface Notification {
    id: bigint;
    message: string;
    category: PolicyCategory;
}
export interface Policy {
    id: bigint;
    name: string;
    category: PolicyCategory;
    benefits: string;
    coverage: string;
    price: number;
}
export interface UserProfile {
    referralCode: string;
    name: string;
    referredBy?: string;
    mobile?: string;
}
export interface CustomerDetails {
    contactTime: string;
    name: string;
    notes: string;
    mobile: string;
}
export enum PolicyCategory {
    motor = "motor",
    otherGeneral = "otherGeneral",
    travel = "travel",
    life = "life",
    termPlan = "termPlan",
    health = "health"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNotification(message: string, category: PolicyCategory): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    comparePolicies(policyIds: Array<bigint>): Promise<Array<Policy>>;
    confirmPolicyIssuance(leadId: bigint): Promise<PolicyIssuanceConfirmation>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNotifications(): Promise<Array<Notification>>;
    getPoliciesByCategory(category: PolicyCategory): Promise<Array<Policy>>;
    getPolicy(policyId: bigint): Promise<Policy>;
    getRewards(): Promise<number>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    requestCallback(customerDetails: CustomerDetails): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLead(policyId: bigint, customerDetails: CustomerDetails): Promise<bigint>;
    updateRewardPercentage(newPercentage: number): Promise<void>;
}
