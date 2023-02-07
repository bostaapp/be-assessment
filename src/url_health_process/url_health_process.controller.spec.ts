import { Test, TestingModule } from "@nestjs/testing";
import { UrlHealthProcessController } from "./url_health_process.controller";
import { UrlHealthProcessService } from "./url_health_process.service";

describe("UrlHealthProcessController", () => {
  let controller: UrlHealthProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlHealthProcessController],
      providers: [UrlHealthProcessService],
    }).compile();

    controller = module.get<UrlHealthProcessController>(
      UrlHealthProcessController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
