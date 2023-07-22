

export default function Accordion() {
    return (
        <div className="join join-vertical w-full">
            <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="my-accordion-4" /> 
                <div className="collapse-title text-xl font-medium">
                <span>
                    🐸 Don't want to get REKT ?
                </span>
                </div>
                <div className="collapse-content"> 
                <p>Get a crosschain cover for a cheap prices. We take advantage of crosschain interoperability to provide you with low rates and good risk diversification so that you can act like a degen on your favorite chain.</p>
                </div>
            </div>
            <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="my-accordion-4" checked={true} /> 
                <div className="collapse-title text-xl font-medium">
                <span>
                    📈 Want to get more yield ?
                </span>
                </div>
                <div className="collapse-content"> 
                <p>Deposit Eth, stEth, sDai, sEth and other yield bearing assets to increase you yield</p>
                </div>
            </div>
        </div>
    )
}