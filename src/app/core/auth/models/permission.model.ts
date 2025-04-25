export interface Permission {
    id: number;
    name: string;
    description: string;
    resource: string;
    action: string;
    createdAt: Date;
    updatedAt: Date;
  }