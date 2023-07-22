import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';

enum Token {
    ETH = "ETH",
    DAI = "DAI",
}

enum RiskLevel {
    A = "A (High risk)",
    B = "B (Medium risk)",
    C = "C (Low risk)",
}


const DepositForm = () => {



    return (
        <>
        <Formik
        initialValues={{
            amount: 0,
            token: Token.ETH,
            riskLevel: RiskLevel.B,
        }}
        onSubmit= {(values:any ) => {
            
            // @Sami: TODO: call the contract
            console.log(values);
            

        }}>
            {({values, setFieldValue}) => (

            <Form className="space-y-4">
            <div className="form-control">

                <label className="label">
                <span className="label-text">Deposit</span>
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
            
            <div className="form-control">
                <label className="label">
                <span className="label-text">Risk/Reward level</span>
                </label>
                <Field as="select" name="riskLevel" className="select select-bordered w-full max-w-xs">
                <option disabled selected>Select your risk level</option>
                {Object.keys(RiskLevel).map((key, idx) => (
                    <option value={key}>{Object.values(RiskLevel)[idx]}</option>
                ))}
                </Field>
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
            </div>
            
            <div className="form-control mt-6">
                <button className="btn btn-primary">Deposit</button>
            </div>
            </Form>
            )}
            </Formik>
        </>
    )
}

export default DepositForm;