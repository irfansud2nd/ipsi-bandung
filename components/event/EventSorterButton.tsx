// "use client";

// import { change } from "@/utils/redux/eventSorter/eventSorterSlice";
// import { RootState } from "@/utils/redux/store";
// import { useDispatch, useSelector } from "react-redux";

// type Props = {
//   label: string;
//   value: string;
// };

// const EventSorterButton = ({ label, value }: Props) => {
//   const sort = useSelector((state: RootState) => state.eventSorter.value);
//   const dispatch = useDispatch();
//   return (
//     <button
//       onClick={() => dispatch(change(value))}
//       className={`border px-2 pb-0.5 font-semibold rounded-full transition-all
//       hover:text-white hover:bg-green-500 hover:border-green-500
//       ${
//         sort == value
//           ? "bg-green-500 text-white border-green-500"
//           : "bg-white border-black"
//       }
//       `}
//     >
//       {label}
//     </button>
//   );
// };
// export default EventSorterButton;
