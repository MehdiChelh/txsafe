import Link from "next/link"


export default function Navbar() {
    return (
        <div className="navbar bg-base-100 p-6">
            <Link href="/" className="flex-1 space-x-4">
                <div className="w-10 rounded-full bg-gray">
                    <img src="/asset/img/icon.svg" />
                </div>
                <span className="normal-case text-3xl font-bold">TxSafe</span>
            </Link>
            <div className="navbar-end">
                <a className="btn btn-primary">Connect Wallet</a>
            </div>
            {/* <div className="flex-none gap-2">
                <div className="form-control">
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-gray">
                    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
                </div>
            </div> */}
        </div>
    )
}