import { useState } from "react";

const SideNav = () => {
  const dateItems = [
    "7 May 2023",
    "3 May 2023",
    "29 April 2023",
    "15 April 2023",
  ];
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <></>
    // <div className="col-2 px-1 bg-dark position-fixed" id="sticky-sidebar">
    //   <div className="nav flex-column flex-nowrap vh-100 overflow-auto text-white p-2">
    //     <button
    //       className="btn btn-outline-light"
    //       onClick={() => {
    //         setSelectedIndex(-1);
    //       }}
    //     >
    //       New Entry
    //     </button>
    //     <h5 className="head1">History</h5>
    //     {dateItems.length === 0 && (
    //       <p className="text-secondary">No items found</p>
    //     )}
    //     <ul className="list-group">
    //       {dateItems.map((item, index) => (
    //         <li
    //           className={
    //             selectedIndex === index
    //               ? "list-group-item px-3 bg-secondary border-0 rounded-3 me-2 active"
    //               : "list-group-item text-secondary bg-dark px-3 border-0 rounded-3 me-2"
    //           }
    //           key={item}
    //           onClick={() => {
    //             setSelectedIndex(index);
    //           }}
    //         >
    //           {item}
    //         </li>
    //       ))}
    //     </ul>
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column-reverse",
    //         height: "100%",
    //       }}
    //     >
    //       <button
    //         className="btn btn-outline-danger"
    //         onClick={() => {
    //           setSelectedIndex(-1);
    //         }}
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SideNav;
