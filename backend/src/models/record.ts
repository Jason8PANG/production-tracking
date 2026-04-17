import { z } from 'zod';

// 验证 schema
export const createRecordSchema = z.object({
  SiteRef: z.string().min(1, '公司别不能为空'),
  Station: z.string().min(1, '站别不能为空'),
  Job: z.string().min(1, '工单号不能为空'),
  CompleteDate: z.string().or(z.date()).refine(
    (val) => !isNaN(Date.parse(String(val))),
    { message: '日期格式无效' }
  )
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;

export interface ProductionRecord {
  id: number;
  SiteRef: string;
  Station: string;
  Job: string;
  CompleteDate: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
