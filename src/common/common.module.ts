import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonService } from "./common.service";
@Module({
  providers: [CommonService, ConfigService],
  exports: [CommonService],
})
export class CommonModule {}
