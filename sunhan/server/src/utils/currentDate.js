import moment from "moment";
import "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const currentDate = () => {
  return moment().format("YYYYMMDD");
};

export default currentDate;
