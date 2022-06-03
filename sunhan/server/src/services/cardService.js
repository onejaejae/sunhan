import { Service } from "typedi";
import axios from "axios";
import currentDate from "../utils/currentDate";
import currentTime from "../utils/currentTime";
import User from "../models/users";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";
import { isValidObjectId } from "mongoose";
import logger from "../config/logger";

@Service()
export default class cardService {
  constructor() {
    this.user = User;
  }

  async getCardBalance(userId, page) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      const headers = {
        Tsymd: currentDate(),
        Iscd: process.env.NH_ISCD,
        FintechApsno: "001",
        ApiSvcCd: "DrawingTransferA",
        AccessToken: process.env.NH_ACCESS_TOKEN,
      };

      page = page ? page : 0;

      const user = await this.user.findById(userId);

      const FinAcno = user.childCard[page].FinAcno;
      const cardName = user.childCard[page].name;
      const accountNumber = user.childCard[page].accountNumber;
      const _id = user.childCard[page].id;
      const Ldbl = await this.inquireBalance(FinAcno, headers);

      return { Ldbl, cardName, accountNumber, _id };
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async createCard(userId, cardDTO) {
    try {
      const user = await this.user.findById(userId);

      if (
        user.childCard.find(
          (card) => card.accountNumber === cardDTO.accountNumber
        )
      ) {
        throw throwError(400, "이미 존재하는 계좌번호입니다.");
      }

      const headers = {
        Tsymd: currentDate(),
        Iscd: process.env.NH_ISCD,
        FintechApsno: "001",
        ApiSvcCd: "DrawingTransferA",
        AccessToken: process.env.NH_ACCESS_TOKEN,
      };

      const { FinAcno, Ldbl } = await this.finAccountDirect(cardDTO, headers);
      cardDTO.FinAcno = FinAcno;
      cardDTO.balance = Ldbl;

      await this.user.findByIdAndUpdate(userId, {
        $push: { childCard: cardDTO },
      });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async finAccountDirect(cardDTO, headers) {
    try {
      headers.Trtm = currentTime();
      headers.ApiNm = "OpenFinAccountDirect";
      headers.IsTuno = parseInt(Math.random() * 1000000000);

      const baseUrl = "https://developers.nonghyup.com/OpenFinAccountDirect.nh";
      const { data } = await axios.post(baseUrl, {
        Header: headers,
        DrtrRgyn: "Y",
        BrdtBrno: cardDTO.birthday,
        Bncd: "011",
        Acno: cardDTO.accountNumber,
      });

      cardDTO.Rgno = data.Rgno;
      const { FinAcno, Ldbl } = await this.cheackOpenFinAccountDirect(
        cardDTO,
        headers
      );

      return { FinAcno, Ldbl };
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async cheackOpenFinAccountDirect(cardDTO, headers) {
    try {
      headers.Trtm = currentTime();
      headers.ApiNm = "CheckOpenFinAccountDirect";
      headers.IsTuno = parseInt(Math.random() * 1000000000);

      const baseUrl =
        "https://developers.nonghyup.com/CheckOpenFinAccountDirect.nh";
      const { data } = await axios.post(baseUrl, {
        Header: headers,
        Rgno: cardDTO.Rgno,
        BrdtBrno: cardDTO.birthday,
      });

      const Ldbl = await this.inquireBalance(data.FinAcno, headers);

      return { FinAcno: data.FinAcno, Ldbl };
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async inquireBalance(FinAcno, headers) {
    try {
      headers.Trtm = currentTime();
      headers.ApiNm = "InquireBalance";
      headers.IsTuno = parseInt(Math.random() * 1000000000);

      const baseUrl = "https://developers.nonghyup.com/InquireBalance.nh";
      const { data } = await axios.post(baseUrl, {
        Header: headers,
        FinAcno: FinAcno,
      });

      return data.Ldbl;
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }

  async deleteCard(userId, cardId) {
    try {
      if (!isValidObjectId(userId)) {
        throw throwError(400, "userId가 유효하지 않습니다.");
      }

      if (!isValidObjectId(cardId)) {
        throw throwError(400, "cardId가 유효하지 않습니다.");
      }

      await this.user.findByIdAndUpdate(userId, {
        $pull: { childCard: { _id: cardId } },
      });
    } catch (error) {
      console.error(error);
      throw serviceError(error);
    }
  }
}
