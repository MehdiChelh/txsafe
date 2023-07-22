import { useState } from "react"
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';

import CoverDepositForm from "@/app/component/CoverDepositForm"
import Navbar from "@/app/component/navbar"
import './globals.css'

enum View {
    Cover,
    Deposit
}

export default function Account() {
  const [accountView, setAccountView] = useState(View.Deposit)
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between bg-base-200">
      <div className="flex flex-col w-full relative h-screen space-y-4">
        <Navbar />
        <div className="z-10 w-full flex flex-col items-center" style={{flex: '1'}}>

            <div className="max-w-5xl w-full font-mono text-sm lg:flex flex flex-col space-y-4">
                <div className="tabs tabs-boxed flex flex-row">
                    <a 
                        className={`tab text-xl ${accountView === View.Cover && "tab-active"}`}
                        onClick={() => setAccountView(View.Cover)}>Your covers</a> 
                    <a 
                        className={`tab  text-xl ${accountView === View.Deposit && "tab-active"}`}
                        onClick={() => setAccountView(View.Deposit)}>Staked amount</a> 
                </div>
                <div className="w-full">
                    <div className="card w-full shadow-2xl bg-base-100">
                        <div className="card-body">
                            {accountView === View.Cover ? 
                                <CoverView /> :
                                <DepositView />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
    </>
  )
}




function CoverView() {
    // @Sami: TODO: fetch data from the contract
    const COVER_DATA = [{
        amount: 20,
        remainingDays: 156,
        protocols: ["aave", "1inch", "uniswap", "makerdao"], 
    }]
    return(
        COVER_DATA.map((cover) => (
        <>
            <h2 className="text-xl font-semibold">Your Covers</h2>
            <div className="stats shadow bg-base-300">
    
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value text-primary">{cover.amount} ETH</div>
                    <div className="stat-desc">Max amount in case of a claim</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Cover</div>
                    <div className="stat-value text-success">{cover.remainingDays} Days</div>
                    <div className="stat-desc">Number of days remaining</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <div className="avatar-group -space-x-6">
                            {cover.protocols.map((protocol) => (
                                <div className="avatar">
                                    <div className="w-12">
                                    <img src={`/asset/img/${protocol}.jpg`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="stat-title">Protocols</div>
                    <div className="stat-value">4</div>
                    <div className="stat-desc">In your cover</div>
                </div>
            </div>
        </>
        ))
    )
}


const RiskLevel = {
    A: "High risk/reward",
    B: "Medium risk/reward",
    C: "Low risk/reward",
}




const Withdraw = ({riskLevel, token}: any) => {
    const [value, setValue] = useState(0);

    const onSubmit = () => {
        // @Sami: TODO: call the contract
        console.log({
            riskLevel,
            token,
            value,
        })
    }
    return(
        <div className="form-control">
            <div className="form-control">
                <div className="input-group">
                    <input
                        type="number" 
                        placeholder="0.01"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="input input-bordered w-36 text-right text-xl" />
                    <button onClick={onSubmit} className="btn text-xl">
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    )
}


function DepositView() {
    // @Sami: TODO: fetch data from the contract
    const STAKED_DATA = {
        "A": {
            "ETH": {
                amount: 34.7,
                profits: 2.6,
            }
        }
    }
    
    return(
        Object.entries(STAKED_DATA).map(([risk, riskValues]:any) => (
            <>
                <h3 className="text-3xl font-semibold">
                    <div className="radial-progress text-primary text-lg mr-4" style={{"--value":75, "--size": "2.5rem"}}></div>
                    {RiskLevel[risk]}
                </h3>
                <div className="divider"></div>
                {Object.entries(riskValues).map(([token, values]:any) => (
                    <>
                        <h2 className="text-2xl font-semibold">{token} Deposit</h2>
                        
                        <div className="flex flex-row">

                            <div className="stats shadow bg-base-300 flex-grow">
                            
                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div className="stat-title">Total amount</div>
                                    <div className="stat-value text-primary">{values.amount}</div>
                                    <div className="stat-desc">Including profits</div>
                                </div>
                                
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div className="stat-title">Profits amount</div>
                                    <div className="stat-value text-secondary">{values.profits}</div>
                                    <div className="stat-desc text-secondary">Insurance profit</div>
                                </div>
                                
                                <div className="stat">
                                    <div className="stat-title">Return</div>
                                    <div className="stat-value">{Math.round(values.profits / values.amount * 10000)/100}%</div>
                                    <div className="stat-desc">Profits / Total</div>
                                </div>
                            
                            </div>
                            <div className="p-4 flex flex-row items-center">
                                <Withdraw riskLevel={risk} token={token} />
                            </div>
                        </div>
                    </>
                ))}
            </>
        ))
    )
}