import { useState } from "react"

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
                        className={`tab ${accountView === View.Cover && "tab-active"}`}
                        onClick={() => setAccountView(View.Cover)}>Your covers</a> 
                    <a 
                        className={`tab ${accountView === View.Deposit && "tab-active"}`}
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
    return(
        <>
            <h2 className="text-xl font-semibold">Your Covers</h2>
            <div className="stats shadow bg-base-300">
    
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value text-primary">20 ETH</div>
                    <div className="stat-desc">Max amount in case of a claim</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Cover</div>
                    <div className="stat-value text-success">156 Days</div>
                    <div className="stat-desc">Number of days remaining</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <div className="avatar-group -space-x-6">
                            <div className="avatar">
                                <div className="w-12">
                                <img src="/asset/img/aave.jpg" />
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-12">
                                <img src="/asset/img/1inch.jpg" />
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-12">
                                <img src="/asset/img/uniswap.jpg" />
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-12">
                                <img src="/asset/img/makerdao.jpg" />
                                </div>
                            </div>
                            <div className="avatar placeholder">
                                <div className="w-12 bg-neutral-focus text-neutral-content">
                                <span>+2</span>
                                </div>
                            </div>
                        </div>
                    {/* <div className="avatar online">
                        <div className="w-16 rounded-full">
                        <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div> */}
                    </div>
                    <div className="stat-title">Protocols</div>
                    <div className="stat-value">4</div>
                    <div className="stat-desc">In your cover</div>
                </div>
                {/* <div className="stat">
                    <div className="stat-title">Total Page Views</div>
                    <div className="stat-value">89,400</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>
                */}
            </div>
            {/* <div className="divider"></div> 
            <h2 className="text-xl font-semibold">Risk management overview</h2>
            <div className="">
                
            </div> */}
        </>
    )
}



function DepositView() {
    return(
        <>
            <h3 className="text-3xl font-semibold">
                <div className="radial-progress text-primary text-lg mr-4" style={{"--value":75, "--size": "2.5rem"}}></div>
                High Risk/Reward
            </h3>
            <div className="divider"></div>
            <h2 className="text-2xl font-semibold">ETH Deposit</h2>
            
            <div className="flex flex-row">

                <div className="stats shadow bg-base-300 flex-grow">
                
                    <div className="stat">
                        <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <div className="stat-title">Total amount</div>
                        <div className="stat-value text-primary">34.7</div>
                        <div className="stat-desc">Including profits</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div className="stat-title">Profits amount</div>
                        <div className="stat-value text-secondary">2.6M</div>
                        <div className="stat-desc text-secondary">Insurance profit</div>
                    </div>
                    
                    <div className="stat">
                        {/* <div className="stat-figure text-secondary">
                        <div className="avatar online">
                            <div className="w-16 rounded-full">
                            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        </div> */}
                        <div className="stat-title">Profits percentage</div>
                        <div className="stat-value">86%</div>
                        <div className="stat-desc">31 tasks remaining</div>
                    </div>
                
                </div>
                <div className="p-4 flex flex-row items-center">
                    
                    <div className="form-control">
                        {/* <label className="label">
                            <span className="label-text">Enter amount</span>
                        </label> */}
                        <div className="form-control">
                            <div className="input-group">
                                <input type="number" placeholder="0.01" className="input input-bordered w-36 text-right text-xl py-8" />
                                <button className="btn text-xl py-8">
                                    Withdraw
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> */}
                                </button>
                            </div>
                        </div>
                        {/* <label className="input-group text-xl">
                            <input type="text" placeholder="0.01" className="input input-bordered w-36 text-xl p-10 text-right" />
                            <button clasName>Withdraw</button>
                        </label> */}
                    </div>
                    {/* <button className="btn join-item">Search</button> */}
                </div>
                {/* <button className="btn btn-primary">
                    hey
                </button> */}
            </div>
        </>
    )
}