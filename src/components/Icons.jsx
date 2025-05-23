import { AiFillLike } from "react-icons/ai";
import {
  FaBookmark,
  FaChevronDown,
  FaCommentDots,
  FaFacebook,
  FaFilter,
  FaHeart,
  FaLink,
  FaPlay,
  FaRegStar,
  FaSearch,
  FaShare,
  FaSort,
  FaStar,
  FaTelegram,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import { FaEarthAfrica } from "react-icons/fa6";
import { IoIosArrowUp, IoIosMenu, IoMdReturnLeft } from "react-icons/io";
import {
  IoClose,
  IoLogOut,
  IoMail,
  IoNotifications,
  IoSend,
} from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const Icons = {
  Play: ({ className = "" }) => <FaPlay className={className} />,
  Search: ({ className = "" }) => <FaSearch className={className} />,
  User: ({ className = "" }) => <FaUser className={className} />,
  Notification: ({ className = "" }) => (
    <IoNotifications className={className} />
  ),
  Menu: ({ className = "" }) => <IoIosMenu className={className} />,
  ArrowUp: ({ className = "" }) => <IoIosArrowUp className={className} />,
  Comment: ({ className = "" }) => <FaCommentDots className={className} />,
  Like: ({ className = "" }) => <AiFillLike className={className} />,
  Star: ({ className = "" }) => <FaStar className={className} />,
  RegStar: ({ className = "" }) => <FaRegStar className={className} />,
  Heart: ({ className = "" }) => <FaHeart className={className} />,
  Send: ({ className = "" }) => <IoSend className={className} />,
  ChevronDown: ({ className = "" }) => <FaChevronDown className={className} />,
  Close: ({ className = "" }) => <IoClose className={className} />,
  Logout: ({ className = "" }) => <IoLogOut className={className} />,
  Filter: ({ className = "" }) => <FaFilter className={className} />,
  Return: ({ className = "" }) => <IoMdReturnLeft className={className} />,
  Sort: ({ className = "" }) => <FaSort className={className} />,
  Share: ({ className = "" }) => <FaShare className={className} />,
  Save: ({ className = "" }) => <FaBookmark className={className} />,
  Delete: ({ className = "" }) => <MdDelete className={className} />,
  Earth: ({ className = "" }) => <FaEarthAfrica className={className} />,

  // Social
  Facebook: ({ className = "" }) => <FaFacebook className={className} />,
  Twitter: ({ className = "" }) => <FaTwitter className={className} />,
  Telegram: ({ className = "" }) => <FaTelegram className={className} />,
  Gmail: ({ className = "" }) => <IoMail className={className} />,
  Link: ({ className = "" }) => <FaLink className={className} />,
};

export default Icons;
