import moment from "moment";
import "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const currentTime = () => {
  return moment().format("HHmmss");
};

export default currentTime;
