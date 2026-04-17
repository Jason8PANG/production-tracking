import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ProductionRecord {
  id?: number;
  SiteRef: string;
  Station: string;
  Job: string;
  CompleteDate: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function createRecord(record: ProductionRecord): Promise<ApiResponse<{ id: number }>> {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  return response.json();
}

export async function getRecords(params?: { SiteRef?: string; Station?: string }): Promise<ApiResponse<ProductionRecord[]>> {
  const searchParams = new URLSearchParams();
  if (params?.SiteRef) searchParams.set('SiteRef', params.SiteRef);
  if (params?.Station) searchParams.set('Station', params.Station);
  
  const response = await fetch(`${API_BASE_URL}/records?${searchParams}`);
  return response.json();
}

export async function deleteRecord(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
