export interface Column {
  name: string;
  type: string;
  length?: string;
  primaryKey: boolean;
  notNull: boolean;
  autoIncrement: boolean;
  unique: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface Database {
  id: string;
  name: string;
  type: string;
  tables: number;
  status: 'healthy' | 'unhealthy' | 'warning' | 'stopped';
}

export interface Table {
  id: string;
  name: string;
  columns: number;
}

export interface TableCreateData {
  tableName: string;
  columns: Column[];
}
