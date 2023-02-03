import { Test, TestingModule } from "@nestjs/testing";
import { UrlHealthProcessService } from "./url_health_process.service";

describe("UrlHealthProcessService", () => {
  let service: UrlHealthProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlHealthProcessService],
    }).compile();

    service = module.get<UrlHealthProcessService>(UrlHealthProcessService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
