import { Service } from "typedi";
import axios from "axios";
import request from "../core";
import Child from "../models/childCardShop";
import Sunhan from "../models/sunhanShop";
import throwError from "../utils/throwError";
import serviceError from "../utils/serviceError";

axios.defaults.timeout = 60000;

@Service()
export default class dataService {
  constructor() {
    this.child = Child;
    this.sunhan = Sunhan;
  }

  async allContentList(baseUrl) {
    try {
      const data = await request.get(baseUrl);

      return data.data.body;
    } catch (error) {
      console.error(error);
    }
  }

  async detailContent(contents) {
    (async () => {
      for (let content of contents) {
        try {
          let baseUrl = `https://map.seoul.go.kr/smgis/apps/poi.do?cmd=getNewContentsDetail&key=${process.env.SUNHAN_API_KEY}&theme_id=11102795&conts_id=${content.cot_conts_id}`;
          const data = await request.get(baseUrl);

          const {
            COT_VALUE_03,
            COT_VALUE_05,
            COT_COORD_Y,
            COT_COORD_X,
            COT_VALUE_01,
            COT_VALUE_02,
            COT_CONTS_NAME,
            COT_TEL_NO,
            COT_IMG_MAIN_URL,
          } = data.data.body[0];

          if (!COT_COORD_X || !COT_COORD_Y) {
            continue;
          }

          const sunhan = new this.sunhan({
            name: COT_CONTS_NAME,
            openingHours: COT_VALUE_01,
            address: COT_VALUE_05,
            tatget: COT_VALUE_03,
            offer: COT_VALUE_02,
            lng: COT_COORD_X,
            lat: COT_COORD_Y,
            location: {
              type: "Point",
              coordinates: [COT_COORD_X, COT_COORD_Y],
            },
            phoneNumber: COT_TEL_NO,
            image: COT_IMG_MAIN_URL,
          });

          await sunhan.save();
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }

  async allChildList(baseUrl) {
    try {
      const {
        data: {
          response: {
            body: { items },
          },
        },
      } = await request.get(baseUrl);

      const result = [];

      for (let i = 0; i < items.length; i++) {
        const {
          mrhstNm,
          mrhstCode,
          ctprvnNm,
          signguNm,
          signguCode,
          rdnmadr,
          latitude,
          longitude,
          phoneNumber,
          weekdayOperOpenHhmm,
          weekdayOperColseHhmm,
          satOperOperOpenHhmm,
          satOperCloseHhmm,
          holidayOperOpenHhmm,
          holidayCloseOpenHhmm,
        } = items[i];

        if (!latitude || !longitude) {
          continue;
        }

        const child = new Child({
          name: mrhstNm,
          code: mrhstCode,
          cityName: ctprvnNm,
          fullCityName: signguNm,
          fullCityNameCode: signguCode,
          address: rdnmadr,
          lat: latitude,
          lng: longitude,
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          phoneNumber: phoneNumber,
          weekdayStartTime: weekdayOperOpenHhmm,
          weekdayEndTime: weekdayOperColseHhmm,
          weekendStartTime: satOperOperOpenHhmm,
          weekendEndTime: satOperCloseHhmm,
          holydayStartTime: holidayOperOpenHhmm,
          holydayEndTime: holidayCloseOpenHhmm,
        });

        result.push(child);
      }

      await this.child.insertMany(result);
    } catch (error) {
      console.error(error);
    }
  }

  async naverSearchApi(baseUrl, query) {
    try {
      const config = {
        query: encodeURI(query),
      };

      const params = new URLSearchParams(config).toString();
      const finalUrl = `${baseUrl}&${params}`;

      const headers = {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_SECRET_KEY,
      };

      const {
        data: { items },
      } = await axios.get(
        `https://openapi.naver.com/v1/search/local.json?query=${encodeURI(
          query
        )}&display=5`,
        { headers }
      );

      console.log(items);
    } catch (error) {
      console.error(error);
    }
  }

  async kakaoSearchApi(type, page) {
    if (type === "sunhan") {
      try {
        const sunhans = await this.sunhan.find();

        const headers = {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        };

        for (let i = 0; i < sunhans.length; i++) {
          // kakao 키워드로 장소 검색하기 api를 통해서 카테고리 정보 받아오기

          // lat, lng가 없는 데이터도 있으므로 분기 필요
          if (
            !sunhans[i].lat ||
            !sunhans[i].lng ||
            sunhans[i].name === "#올헤어"
          ) {
            continue;
          }

          const {
            data: { documents },
          } = await request.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
              sunhans[i].name
            )}&y=${sunhans[i].lng}&x=${sunhans[i].lat}&size=1&sort=distance`,
            { headers }
          );

          // 해당 가맹점 정보가 없다면 continue
          if (Array.isArray(documents) && documents.length === 0) {
            continue;
          }

          // 공백문자 제거
          let categoryName = documents[0].category_name;
          let category = categoryName.split(">");

          const detailCategory = category[category.length - 1].trim();

          // 카테고리의 data가 0번째 인덱스까지만 있는 경우가 있으므로 구분을 해줌.
          if (category.length === 1) {
            category = category[0].trim();
          } else {
            category = category[1].trim();
          }

          sunhans[i].category = category;
          sunhans[i].detailCategory = detailCategory;

          await sunhans[i].save();
        }
      } catch (error) {
        console.error(error);
      }
    } else if (type === "children") {
      try {
        const newChildrens = [];
        const childrens = await this.child
          .find()
          .skip(page * 5000)
          .limit(5000);

        const headers = {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        };

        for (let i = 0; i < childrens.length; i++) {
          // kakao 키워드로 장소 검색하기 api를 통해서 카테고리 정보 받아오기

          // lat, lng가 없는 데이터도 있으므로 분기 필요
          if (!childrens[i].lat || !childrens[i].lng) {
            continue;
          }

          const {
            data: { documents },
          } = await request.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
              childrens[i].name
            )}&y=${childrens[i].lng}&x=${
              childrens[i].lat
            }&size=1&sort=distance`,
            { headers }
          );

          // 해당 가맹점 정보가 없다면 continue
          if (Array.isArray(documents) && documents.length === 0) {
            continue;
          }

          // 공백문자 제거
          let categoryName = documents[0].category_name;
          let category = categoryName.split(">");

          const detailCategory = category[category.length - 1].trim();

          // 카테고리의 data가 0번째 인덱스까지만 있는 경우가 있으므로 구분을 해줌.
          if (category.length === 1) {
            category = category[0].trim();
          } else {
            category = category[1].trim();
          }

          childrens[i].category = category;
          childrens[i].detailCategory = detailCategory;

          newChildrens.push(childrens[i].save());
        }

        await Promise.all(newChildrens);
        console.log("complete!!");
      } catch (error) {
        console.error(error);
      }
    } else {
      throw throwError(400, "해당 type가 존재하지 않습니다.");
    }
  }
}
