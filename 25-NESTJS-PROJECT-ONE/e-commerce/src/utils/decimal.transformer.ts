import { ValueTransformer } from 'typeorm';

export const DecimalTransformer: ValueTransformer = {
  to: (value?: number): number | null => value ?? null,

  from: (value?: string): number | null =>
    value == null ? null : Number(value),
};
