```jsx
import { useEffect, useState } from "react";

const markets = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    price: 4174.5,
    change: 0.81,
    direction: "BULLISH",
    points: [40, 44, 42, 49, 46, 53, 50, 58, 55, 63, 60, 68],
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    price: 86260,
    change: 0.06,
    direction: "BULLISH",
    points: [65, 60, 63, 57, 59, 52, 55, 50, 53, 47, 49, 45],
  },
  {
    symbol: "EURUSD",
    name: "Euro / Dollar",
    price: 1.1267,
    change: 0.42,
    direction: "BULLISH",
    points: [35, 39, 37, 44, 42, 48, 46, 52, 50, 56, 54, 60],
  },
];

function MiniChart({ points }) {
  const width = 260;
  const height = 70;

  const min = Math.min(...points);
  const max = Math.max(...points);

  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y =
        height -
        ((point - min) / (max - min || 1)) * (height - 10) -
        5;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      className="market-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function MarketPulse() {
  const [selected, setSelected] = useState(0);

  const [prices, setPrices] = useState(
    markets.map((market) => market.price)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((currentPrices) =>
        currentPrices.map((price, index) => {
          let movement;

          if (index === 0) {
            movement = (Math.random() - 0.45) * 2;
          } else if (index === 1) {
            movement = (Math.random() - 0.48) * 40;
          } else {
            movement = (Math.random() - 0.45) * 0.001;
          }

          return price + movement;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const selectedMarket = markets[selected];

  return (
    <section className="market-pulse">
      <div className="market-pulse-header">
        <div>
          <span className="market-label">
            MARKET PULSE
          </span>

          <span className="market-live">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>

        <span className="market-time">
          REAL-TIME VIEW
        </span>
      </div>

      <div className="market-list">
        {markets.map((market, index) => (
          <button
            key={market.symbol}
            type="button"
            className={`market-row ${
              selected === index ? "active" : ""
            }`}
            onClick={() => setSelected(index)}
          >
            <div className="market-name">
              <strong>{market.symbol}</strong>
              <span>{market.name}</span>
            </div>

            <div className="market-mini-chart">
              <MiniChart points={market.points} />
            </div>

            <div className="market-price">
              <strong>
                {index === 2
                  ? prices[index].toFixed(4)
                  : prices[index].toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
              </strong>

              <span
                className={
                  market.change >= 0
                    ? "market-change positive"
                    : "market-change negative"
                }
              >
                {market.change >= 0 ? "+" : ""}
                {market.change.toFixed(2)}%
              </span>
            </div>

            <div className="market-direction">
              {market.direction}
            </div>
          </button>
        ))}
      </div>

      <div className="market-analysis">
        <div className="analysis-top">
          <span>TYG MARKET VIEW</span>

          <span className="analysis-symbol">
            {selectedMarket.symbol}
          </span>
        </div>

        <div className="analysis-main">
          <div>
            <small>TREND</small>
            <strong>{selectedMarket.direction}</strong>
          </div>

          <div>
            <small>PRICE</small>
            <strong>
              {selected === 2
                ? prices[selected].toFixed(4)
                : prices[selected].toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
            </strong>
          </div>

          <div>
            <small>BIAS</small>
            <strong>POSITIVE</strong>
          </div>
        </div>

        <p>
          {selectedMarket.symbol} is showing positive momentum.
          This is a visual market demo and not financial advice.
        </p>
      </div>
    </section>
  );
}
```
