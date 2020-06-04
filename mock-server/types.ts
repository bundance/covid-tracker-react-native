export interface DbConfig {
  [x: string]: { path: string; defaultData?: unknown };
}
export interface Patient {
  id: string;
  last_reported_at: string;
}

export interface Assessment {
  id: string;
  patient: string;
  profile_attributes_updated_at: string;
}

export interface CovidTest {
  id: string;
  patient: string;
}

export interface Contributions {
  id: string;
  report_count: number;
  contribution_for_others_count: number;
}
