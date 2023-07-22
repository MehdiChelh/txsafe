'use client'
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';

import AutoComplete from "./AutoComplete"


enum Token {
    ETH = "ETH",
    DAI = "DAI",
}

const mapping = {
    uniswap: "asset/img/uniswap.jpg",
    aave: "asset/img/aave.jpg",
    "1inch": "asset/img/1inch.jpg",
    makerdao : "asset/img/makerdao.jpg",
}

const protocols = [
    "uniswap", "1inch", "makerdao"
];

export default function CoverForm() {
    
    // const [_protocols, setValues] = useState([]);

    return (
        <>
        <Formik
        initialValues={{
            amount: 0,
            token: Token.ETH,
            period: 28,
            protocols: [],
        }}
        onSubmit= {(values:any ) => {
                
            // @Sami: TODO: call the contract
            console.log(values);

        }}>
            {({values, setFieldValue}) => (

            <Form className="space-y-4">

            {/* Amount */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text"><span className="mr-2">Amount</span>
                        <div className="tooltip" data-tip="Maximum amount covered in the case of a claim. See terms bellow for more details.">
                            <span className="rounded-full border-2 border-gray-400 px-1">i</span>
                        </div>
                    </span>
                </label>
                <div className="input input-bordered flex flex-row" style={{height: "initial", paddingRight: "initial", paddingLeft: "initial"}}>
                <Field type="number" name="amount" placeholder="0" className="bg-transparent outline-none text-right flex-grow p-4" />
                <div className="dropdown dropdown-hover">
                    <label tabIndex={0} className="btn m-1">{values.token}</label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                    {Object.keys(Token).map((token) => (
                        <li onClick={() => setFieldValue("token", token)}><a>{token}</a></li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>

            {/* Period */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text"><span className="mr-2">Period</span>
                        <div className="tooltip" data-tip="Number of days of cover.">
                            <span className="rounded-full border-2 border-gray-400 px-1">i</span>
                        </div>
                    </span>
                </label>
                <div className="input input-bordered flex flex-row space-x-2" style={{height: "initial", paddingRight: "initial", paddingLeft: "initial"}}>
                    <Field type="number" name="period" placeholder="28" className="bg-transparent outline-none text-right flex-grow" />
                    <div className="dropdown ">
                        <label tabIndex={0} className="btn m-1 hover:cursor-default">DAYS</label>
                    </div>
                </div>
            </div>
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text"><span className="mr-2">Protocols</span>
                        <div className="tooltip" data-tip="The protocols for which you want to be covered.">
                            <span className="rounded-full border-2 border-gray-400 px-1">i</span>
                        </div>
                    </span>
                </label>
                <AutoComplete values={values.protocols} setValues={(vals: any) => setFieldValue("protocols", vals)} items={protocols} metadata={{mapping}} />
            </div>

            {/* <div className="form-control">
                <label className="label">
                <span className="label-text">Risk level</span>
                </label>
                <select className="select select-bordered w-full max-w-xs">
                <option disabled selected>Select your risk level</option>
                <option>A (High risk)</option>
                <option>B (Medium risk)</option>
                <option>C (Low risk)</option>
                </select>
            </div>

            <div className="form-control flex flex-col">
                <label className="label space-x-2 flex">
                <span className="label-text badge badge-ghost p-4 rounded-md space-x-2">
                    <span className="">APY (last 30 days):</span>
                    <span className="label-text badge badge-success badge-outline">20.3%</span>
                </span>
                </label>
                <label className="label space-x-2 flex">
                <span className="label-text badge badge-ghost p-4 rounded-md space-x-2">
                    <span className="">Max Drawdown:</span>
                    <span className="label-text badge badge-secondary badge-outline">-10.4%</span>
                </span>
                </label>
            </div> */}
            
            <div className="form-control mt-6">
                <button className="btn btn-primary">Buy Cover</button>
            </div>
            </Form>
            )}
            </Formik>
        </>
    )
}