
export default function DepositForm() {
    return (
        <>
            <div className="form-control">
                
                <label className="label">
                <span className="label-text">Deposit</span>
                </label>
                <div className="input input-bordered" style={{height: "initial", paddingRight: "initial", paddingLeft: "initial"}}>

                <div className="dropdown dropdown-hover">
                    <label tabIndex={0} className="btn m-1">ETH</label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                    <li><a>ETH</a></li>
                    <li><a>DAI</a></li>
                    </ul>
                </div>
                <input type="number" placeholder="0" className="bg-transparent outline-none text-right" />
                </div>
            </div>
            
            <div className="form-control">
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
            </div>
            
            <div className="form-control mt-6">
                <button className="btn btn-primary">Deposit</button>
            </div>
        </>
    )
}