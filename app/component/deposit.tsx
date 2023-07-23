import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { utils, providers, Contract, BigNumber } from "ethers";

import txSafeContract from "../../contracts/txsafe.json"

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

const provider = new providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC);
const txsafeC = new Contract(process.env.NEXT_PUBLIC_TXSAFE_CONTRACT_ADDRESS, txSafeContract.abi, provider);


enum Token {
    NATIVE = "ETH",
    stNATIVE = "aETH",
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
        onSubmit= { async (values:any ) => {
            
            // @Sami: TODO: call the contract
            const poolMapping = {
                "A": 2,
                "B": 1,
                "C" : 0
            }

            console.log(values.riskLevel)

            const deposit_amount = values.amount
            const deposit_pool = poolMapping[values.riskLevel]
            const deposit_token = values.token

            console.log(Date.now())

            if (deposit_token == "NATIVE") {
                const tx = await txsafeC.populateTransaction.deposit_native("100", deposit_pool, Date.now());

                const transactionParameters = {
                    to: tx.to,
                    from: window.ethereum.selectedAddress,
                    value: "100"
                  };

                await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                  });
            } else {

            }
            
            

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
                <button type="submit" className="btn btn-primary">Deposit</button>
            </div>
            </Form>
            )}
            </Formik>
        </>
    )
}

export default DepositForm;