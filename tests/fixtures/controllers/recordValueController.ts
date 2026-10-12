import { Get, Route } from '@tsoa/runtime';

export interface RecordValueModel {
  label: string;
}

export interface RecordHolder {
  nullableStrings: Record<string, string | null>;
  models: Record<string, RecordValueModel>;
}

@Route('RecordValue')
export class RecordValueController {
  @Get()
  public async getRecords(): Promise<Partial<RecordHolder>> {
    return {};
  }
}
