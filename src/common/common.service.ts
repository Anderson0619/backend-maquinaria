import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { NodrizeCommonService } from "@nodrize/nodrize";
import { ResponseDto } from "@nodrize/nodrize/dist/dto/response.dto";
import { ScheduleDto } from "@nodrize/nodrize/dist/dto/schedule.dto";
import { SendEmailDto } from "@nodrize/nodrize/dist/dto/send-email.dto";
import { SendSmsDto } from "@nodrize/nodrize/dist/dto/send-sms.dto";
import { UploadDto } from "@nodrize/nodrize/dist/dto/upload.dto";
import { UserInputError } from "apollo-server-express";
import * as fileType from "file-type";
import { FileTypeResult } from "file-type";
import { I18nRequestScopeService } from "nestjs-i18n/dist/services/i18n-request-scope.service";
import DocumentModel from "src/helpers/types/document-model.type";
import { v4 as uuid } from "uuid";
import { Counter, CounterDocument } from "./counter.schema";

const QrCode = require("../helpers/qrcode/easyqrcodejs-nodejs");
const Slugify = require("slugify");
const Stream = require("stream");
const HtmlToPdf = require("html-pdf-node");

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: DocumentModel<CounterDocument, Counter>,
    private readonly configService: ConfigService,
    private readonly nodrizeCommonService: NodrizeCommonService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  /**
   * This method allows you send emails throught defined domains in yout Nodrize API Token.
   * @param sendEmailDto SendEmailDto (from, to, subject, text, html, templateId, dynamic_template_data, cb)
   */
  async sendEmail(sendEmailDto: SendEmailDto): Promise<ResponseDto> {
    return this.nodrizeCommonService.sendEmail(sendEmailDto);
  }

  /**
   * This method allows you upload a base64 encoded archive
   * @param uploadDto uploadDto (data, filename, path)
   */
  async upload(uploadDto: UploadDto): Promise<string> {
    return this.nodrizeCommonService.upload(uploadDto);
  }

  /**
   * This method allows you to send SMS
   * @param sendSmsDto sendSmsDto (to, text)
   */
  async sendSms(sendSmsDto: SendSmsDto): Promise<void> {
    return this.nodrizeCommonService.sendSms(sendSmsDto);
  }

  /**
   * This method allows you to schedule a callback
   * to a controlled end or api
   * @param scheduleDto scheduleDto (callBackDate, callBackUrl, callBackPath, callBackMethod, dynamicObject, headers)
   */
  async scheduleTask(scheduleDto: ScheduleDto): Promise<ResponseDto> {
    return await this.nodrizeCommonService.scheduleTask(scheduleDto);
  }

  /**
   * This method allows you to obtain the next sequence value
   * @param name name of the sequence
   * @returns
   */
  async getNextSequence(name: string): Promise<number> {
    const ret = await this.counterModel.findOneAndUpdate(
      { _id: name },
      { $inc: { sequence: 1 } },
      { upsert: true, returnOriginal: false },
    );

    return ret.sequence;
  }

  /**
   * This method allows you to create a unique sequence
   * @param sequenceName name of the sequence
   * @returns a promise that resolves to the next sequence value
   */
  async createSquence(sequenceName: string): Promise<Counter> {
    const createdCounter = new this.counterModel({
      _id: sequenceName,
      sequence: 0,
    });

    return createdCounter.save();
  }

  /**
   * This method allows you to create an id
   * @param length length of the generated string
   * @returns
   */
  async makeId(length: number): Promise<string> {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * This method allows you to generate QR
   * @param url the url inside the QR
   * @param vendor vendor to store the QR Image
   */
  async generateQR(
    url: string,
    vendor: string,
  ): Promise<{ fileUrl: string; base64: string }> {
    const options = {
      text: url,
      width: 600,
      height: 600,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QrCode.CorrectLevel.H,
      dotScale: 1,
      quietZone: 0,
      quietZoneColor: "transparent",
      logo: this.configService.get<string>("GENERAL_SITE_LOGO"),
      logoWidth: 180,
      logoHeight: 180,
      logoBackgroundTransparent: true,

      PO: "#3fbe1b", // Global Posotion Outer color. if not set, the defaut is `colorDark`
      PI: "#100302", // Global Posotion Inner color. if not set, the defaut is `colorDark`
      PO_TL: "", // Posotion Outer color - Top Left
      PI_TL: "", // Posotion Inner color - Top Left
      PO_TR: "", // Posotion Outer color - Top Right
      PI_TR: "", // Posotion Inner color - Top Right
      PO_BL: "", // Posotion Outer color - Bottom Left
      PI_BL: "", // Posotion Inner color - Bottom Left

      AO: "", // Alignment Outer. if not set, the defaut is `colorDark`
      AI: "", // Alignment Inner. if not set, the defaut is `colorDark`

      timing: "#3fbe1b", // Global Timing color. if not set, the defaut is `colorDark`
      timing_H: "", // Horizontal timing color
      timing_V: "", // Vertical timing color
    };

    const today = new Date();
    const qrcode = new QrCode(options);
    let b64Qr = "";

    await qrcode.toDataURL().then((data: string) => {
      b64Qr = data;
    });

    const uploadDto: UploadDto = {
      data: b64Qr,
      filename: `${uuid()}.png`,
      path: `${vendor}/qr_generator/${today.getFullYear()}/${today.getMonth()}`,
    };

    const fileUrl = await this.upload(uploadDto);

    return { fileUrl: fileUrl, base64: b64Qr };
  }

  /**
   * This method allows you create a slug
   * @param name text to be slugify
   * @param replacement character to concatenate the slug
   * @param lower boolean true will be lowercase
   */
  generateSlug(name: string, replacement: string, lower: boolean): string {
    return Slugify(name, {
      replacement,
      remove: undefined,
      lower,
      strict: false,
      locale: "vi",
    });
  }

  /**
   * This method allows you to obtain the extension of a file in base64
   * @param base64 base64 encoded image
   * @returns
   */
  async getExtensionFromBase64(base64: string): Promise<string> {
    const matches = base64.match(/^data:([@A-Za-z-+0-9\.\/]+);base64,(.+)$/);

    if (!matches)
      throw new UserInputError(
        await this.i18n.t("errors.FILE_FORMAT_NOT_SUPPORTED"),
      );

    const bufferStream = new Stream.PassThrough();
    const buffer = Buffer.from(matches[2], "base64");
    const mimeType: FileTypeResult = await fileType.fromBuffer(buffer);
    bufferStream.end(buffer);

    // * workaround for file-type not recognized by the extensions
    if (mimeType === undefined) {
      const base64ContentArray = base64.split(",");
      return base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
    }

    return mimeType?.ext;
  }

  /*
   * This method allows you to obtain duration in seconds from a duration string
   * @param duration duration string
   * @returns duration in seconds
   * */
  async getDurationInSeconds(duration: string): Promise<number> {
    const units: any = { h: 3600, m: 60, s: 1 };
    const regex = /(\d+)([hms])/g;

    let seconds = 0;
    let match;
    while ((match = regex.exec(duration))) {
      seconds += parseInt(match[1]) * units[match[2]];
    }

    return seconds;
  }

  /*
   * This method allows you to generate a pdf file from a html string, also allows you to modify dynamically the html based on {{subtitutions}}
   * @param html html string
   * @param subtitutions object with the substitutions in this format {key: value}
   * @param path? path to the pdf file
   * @param filename? filename of the pdf file
   * @returns a promise that resolves to the pdf file uploaded to nodrize cms
   * */
  async generatePdf(
    htmlTemplate: string,
    subtitutions: any,
    vendor: string,
    path?: string,
    filename?: string,
  ): Promise<string> {
    const options = { format: "A4" };
    if (subtitutions) {
      for (const key in subtitutions) {
        htmlTemplate = htmlTemplate.replace(
          new RegExp(`{{${key}}}`, "g"),
          subtitutions[key],
        );
      }
    }

    const file = { content: htmlTemplate };
    const bufferFile = await HtmlToPdf.generatePdf(file, options);
    const base64 = Buffer.from(bufferFile).toString("base64");

    const uploadDto: UploadDto = {
      data: `data:application/pdf;base64,${base64}`,
      filename: filename || `${uuid()}_${new Date().getTime()}.pdf`,
      path: path || `vendor/${vendor}/uploads`,
    };

    return await this.upload(uploadDto);
  }
}
