// Helper type
export type NumberFields<T> = {
  [P in keyof T]: number;
};
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
export type RequiredField<T, K extends keyof T, Y extends keyof T> = Omit<
  Omit<Nullable<Omit<T, K>> & Required<Pick<T, K>>, Y>,
  'createdAt' | 'updatedAt'
> &
  Required<NumberFields<Pick<T, Y>>> & {
    createdAt: string;
    updatedAt?: string | null;
  };
