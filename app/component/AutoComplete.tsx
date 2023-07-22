
// import classNames from "classnames";
import React, { memo, useRef, useState } from "react";

type Props = {
  values: string[];
  items: string[];
  setValues: any;
  metadata: {mapping: {[key: string]: string}};
};


//we are using dropdown, input and menu component from daisyui
const Autocomplete = (props: Props) => {
  const [query, setQuery] = useState("");
  const { values, setValues, items, metadata} = props;
  const mapping = {metadata};
  const pushValue = (value: string) => {
    if (!values.includes(value)) {
      setValues([...values, value]);
    }
  }

  const popValue = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter(v => v !== value));
    }
  }

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div
      // use classnames here to easily toggle dropdown open 
      className={`dropdown w-full ${open ? "dropdown-open": ""}`}
      ref={ref}
    >
      <div className="form-control">
        <div className="input input-bordered flex flex-row" style={{height: "initial", paddingRight: "initial", paddingLeft: "initial"}}>
            <div className="dropdown dropdown-hover flex flex-row items-center px-2">
            {values.map((value, key) => (
                // <span key={key} className="">
                //     <label className="btn m-1 relative">
                //         {value}
                //         <span onClick={() => popValue(value)}className="absolute top-0 right-0 hover:bg-black p-1 rounded-md">
                //             x
                //         </span>
                //     </label>
                // </span>
                <div key={key} className="avatar relative">
                        <span onClick={() => popValue(value)}className="absolute top-0 right-0 -mr-2 -mt-2 hover:bg-base-200 bg-base-100/50 px-1 rounded-full cursor-pointer">
                            x
                        </span>
                    <div className="w-10 h-10 rounded-full">
                        <img src={`asset/img/${value}.jpg`} />
                    </div>
                </div>
            ))}
                
            </div>
            <div className="flex-grow flex flex-row-reverse">
                <input
                    value={query}
                    className="bg-transparent outline-none text-right p-4 flex-grow"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type something.."
                    tabIndex={0} />
            </div>
        </div>
        {/* <input
            type="text"
            className="input input-bordered w-full"
            value={value}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type something.."
            tabIndex={0}
        /> */}
      </div>
      {/* <div className="form-control">
        <label className="label">
            <span className="label-text"><span className="mr-2">Amount</span>
                <div className="tooltip" data-tip="Maximum amount covered in the case of a claim. See terms bellow for more details.">
                    <span className="rounded-full border-2 border-gray-400 px-1">i</span>
                </div>
            </span>
        </label>
        <div className="input input-bordered" style={{height: "initial", paddingRight: "initial", paddingLeft: "initial"}}>
        <div className="dropdown dropdown-hover">
            <label className="btn m-1">ETH</label>
            
        </div>
        <input
            value={value}
            className="bg-transparent outline-none text-right"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type something.."
            tabIndex={0} />
        </div>
        </div> */}
      {/* add this part */}
      <div className="dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md">
        <ul
          className="menu menu-compact "
          // use ref to calculate the width of parent
          style={{ width: ref.current?.clientWidth }}
        >
          {items.filter(item => item.includes(query)).map((item, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  pushValue(item);
                  setOpen(false);
                }}
                className="border-b border-b-base-content/10 w-full"
              >
                <button>{item}</button>
              </li>
            );
          })}
        </ul>
        {/* add this part */}
      </div>
    </div>
  );
};

export default memo(Autocomplete);