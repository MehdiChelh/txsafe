import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { utils, providers, Contract, BigNumber } from "ethers";

import txSafeContract from "../../contracts/txsafe.json";
import stNativeContract from "../../contracts/stnative.json";
import daiContract from "../../contracts/dai.json";
import txsContract from "../../contracts/txs.json";

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

const provider = new providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC);
const txsafeC = new Contract(process.env.NEXT_PUBLIC_TXSAFE_CONTRACT_ADDRESS, txSafeContract.abi, provider);
const stNativeC = new Contract(process.env.NEXT_PUBLIC_STNATIVE_CONTRACT_ADDRESS, stNativeContract.abi, provider);
const daiC = new Contract(process.env.NEXT_PUBLIC_DAI_CONTRACT_ADDRESS, daiContract.abi, provider);
const txsC = new Contract(process.env.NEXT_PUBLIC_TXS_CONTRACT_ADDRESS, txsContract.abi, provider);


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

            const deposit_amount = values.amount
            const deposit_pool = poolMapping[values.riskLevel]
            const deposit_token = values.token

            if (deposit_token == "NATIVE") {
                const tx = await txsafeC.populateTransaction.deposit_native(utils.parseUnits(deposit_amount.toString(), "ether"), 1, Date.now());

                const transactionParameters = {
                    to: tx.to,
                    from: window.ethereum.selectedAddress,
                    data: tx.data,
                    value:  utils.parseUnits(deposit_amount.toString(), "ether")._hex
                  };

                await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                  });
            } else if (deposit_token == "stNATIVE") {
                const approval = await stNativeC.populateTransaction.approve(txsafeC.address, utils.parseUnits("1000000000000000000000000", "ether"));
                const from = window.ethereum.selectedAddress

                const approvalParameters = {
                to: approval.to,
                from: from,
                data: approval.data
                };
                const approved = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [approvalParameters],
                });

                await provider.waitForTransaction(approved)
                const tx = await txsafeC.populateTransaction.deposit(deposit_token, utils.parseUnits(deposit_amount.toString(), "ether"), 1, Date.now());

                const transactionParameters = {
                to: tx.to,
                from: from,
                data: tx.data
                };
                await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
                });
            } else if (deposit_token == "DAI") { 
                const approval = await daiC.populateTransaction.approve(txsafeC.address, utils.parseUnits("1000000000000000000000000", "ether"));
                const from = window.ethereum.selectedAddress

                const approvalParameters = {
                to: approval.to,
                from: from,
                data: approval.data
                };
                const approved = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [approvalParameters],
                });

                await provider.waitForTransaction(approved)
                const tx = await txsafeC.populateTransaction.deposit(deposit_token, utils.parseUnits(deposit_amount.toString(), "ether"), 1, Date.now());

                const transactionParameters = {
                to: tx.to,
                from: from,
                data: tx.data
                };
                await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
                });
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