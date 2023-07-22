'use client'
import DepositForm from "./deposit"
import CoverForm from "./cover"
import { useState } from "react"

enum Form {
  Deposit,
  Cover
}

export default function CoverDepositForm() {
    const [showForm, setShowForm] = useState(Form.Cover)

    return (
    <div className="flex-shrink-0 w-full max-w-sm space-y-2">
        <div className="tabs tabs-boxed">
        <a 
            className={`tab text-xl ${showForm === Form.Deposit && "tab-active"}`}
            onClick={() => setShowForm(Form.Deposit)}>Deposit</a> 
        <a 
            className={`tab text-xl ${showForm === Form.Cover && "tab-active"}`}
            onClick={() => setShowForm(Form.Cover)}>Get covered</a> 
        </div>

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
            {showForm === Form.Cover ? 
            <CoverForm /> :
            <DepositForm />
            }
        </div>
        </div>

    </div>
    )
}