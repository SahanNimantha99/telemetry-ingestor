import {
  IsString,
  IsISO8601,
  ValidateNested,
  IsNumber,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class MetricsDto {
  @IsNumber() temperature: number;
  @IsNumber() humidity: number;
}

export class IngestTelemetryDto {
  @IsString() @IsNotEmpty() deviceId: string;
  @IsString() @IsNotEmpty() siteId: string;
  @IsISO8601() ts: string;
  @IsObject() @ValidateNested() @Type(() => MetricsDto) metrics: MetricsDto;
}
