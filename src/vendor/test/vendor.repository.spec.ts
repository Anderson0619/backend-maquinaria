import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { FilterQuery } from "mongoose";
import { VendorRepository } from "../vendor.repository";
import { Vendor, VendorDocument } from "../vendor.schema";
import { vendorStub } from "./stubs/vendor.stub";
import { VendorModel } from "./support/vendor.model";

describe("VendorRepository", () => {
  let vendorRepository: VendorRepository;

  describe("find operations", () => {
    let vendorModel: VendorModel;
    let vendorFilterQuery: FilterQuery<VendorDocument>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          VendorRepository,
          {
            provide: getModelToken(Vendor.name),
            useClass: VendorModel,
          },
        ],
      }).compile();

      vendorRepository = moduleRef.get<VendorRepository>(VendorRepository);
      vendorModel = moduleRef.get<VendorModel>(getModelToken(Vendor.name));

      vendorFilterQuery = {
        id: vendorStub().id,
      };

      jest.clearAllMocks();
    });

    describe("findOne", () => {
      describe("when findOne is called", () => {
        let Vendor: Vendor;

        beforeEach(async () => {
          jest.spyOn(vendorModel, "findOne");
          Vendor = await vendorRepository.findOne(vendorFilterQuery);
        });

        test("then it should call the VendorModel", () => {
          expect(vendorModel.findOne).toHaveBeenCalledWith(vendorFilterQuery, {
            _id: 0,
            __v: 0,
          });
        });

        test("then it should return a Vendor", () => {
          expect(Vendor).toEqual(vendorStub());
        });
      });
    });

    describe("find", () => {
      describe("when find is called", () => {
        let vendors: Vendor[];

        beforeEach(async () => {
          jest.spyOn(vendorModel, "find");
          vendors = await vendorRepository.find(vendorFilterQuery);
        });

        test("then it should call the VendorModel", () => {
          expect(vendorModel.find).toHaveBeenCalledWith(vendorFilterQuery);
        });

        test("then it should return a Vendor", () => {
          expect(vendors).toEqual([vendorStub()]);
        });
      });
    });

    describe("findOneAndUpdate", () => {
      describe("when findOneAndUpdate is called", () => {
        let Vendor: Vendor;

        beforeEach(async () => {
          jest.spyOn(vendorModel, "findOneAndUpdate");
          Vendor = await vendorRepository.findOneAndUpdate(
            vendorFilterQuery,
            vendorStub(),
          );
        });

        test("then it should call the VendorModel", () => {
          expect(vendorModel.findOneAndUpdate).toHaveBeenCalledWith(
            vendorFilterQuery,
            vendorStub(),
            {
              new: true,
            },
          );
        });

        test("then it should return a Vendor", () => {
          expect(Vendor).toEqual(vendorStub());
        });
      });
    });
  });

  describe("create operations", () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          VendorRepository,
          {
            provide: getModelToken(Vendor.name),
            useValue: VendorModel,
          },
        ],
      }).compile();

      vendorRepository = moduleRef.get<VendorRepository>(VendorRepository);
    });

    describe("create", () => {
      describe("when create is called", () => {
        let Vendor: Vendor;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(VendorModel.prototype, "save");
          constructorSpy = jest.spyOn(VendorModel.prototype, "constructorSpy");
          Vendor = await vendorRepository.create(vendorStub());
        });

        test("then it should call the VendorModel", () => {
          expect(saveSpy).toHaveBeenCalled();
          expect(constructorSpy).toHaveBeenCalledWith(vendorStub());
        });

        test("then it should return a Vendor", () => {
          expect(Vendor).toEqual(vendorStub());
        });
      });
    });
  });
});
