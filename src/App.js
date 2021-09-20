import "./App.css";
import { useMemo, useState, useEffect } from "react";
import { Table, AvatarCell, WatchlistIconCell, ColorTdCell } from "./Table";
import axios from "axios";

const abbreviateNumber = (num, fixed) => {
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "k", "m", "b", "t"][k]; // append power
  return e;
};

function App() {
  const [coins, setCoins] = useState([]);
  const [watchedCoins, setWatchedCoins] = useState([]);
  const [isWatchlistViewMode, setViewMode] = useState(false);
  useEffect(() => fetchData(), []);

  const handleOnClick = () => {
    setViewMode(!isWatchlistViewMode);
    if (isWatchlistViewMode) {
      fetchData();
    } else {
      setCoins(watchedCoins);
    }
  };

  const fetchData = () => {
    axios
      .get("https://api.coincap.io/v2/assets")
      .then((res) => {
        let { data } = res.data;
        data.forEach((o) => {
          o.symbol = o.symbol.toLowerCase();
          o.priceUsd =
            "$" + (+o.priceUsd).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
          o.supply = abbreviateNumber(parseFloat(o.supply), 2);
          o.volumeUsd24Hr = abbreviateNumber(parseFloat(o.volumeUsd24Hr), 2);
          o.marketCapUsd = abbreviateNumber(parseFloat(o.marketCapUsd), 2);
          o.changePercent24Hr = (+o.changePercent24Hr).toFixed(2);
          o.isWatching = false;
        });
        setCoins(data);
      })
      .catch((err) => console.log(err));
  };

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "addWatchlist",
        Cell: ({ value, row, column }) => {
          const { original: coin } = row;
          const { isWatching } = coin;

          const handleItemClick = () => {
            if (isWatching) {
              coin.isWatching = false;
              setWatchedCoins((watchedCoins) =>
                watchedCoins.filter((item) => item.id !== coin.id)
              );
            } else {
              coin.isWatching = true;
              setWatchedCoins((watchedCoins) => [...watchedCoins, coin]);
            }
          };

          return (
            <WatchlistIconCell
              isWatching={isWatching}
              onItemClick={handleItemClick}
            />
          );
        },
      },
      {
        Header: "Rank",
        accessor: "rank",
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: AvatarCell,
        symbolAccessor: "symbol",
      },
      {
        Header: "Price",
        accessor: "priceUsd",
      },
      {
        Header: "Market Cap",
        accessor: "marketCapUsd",
      },
      {
        Header: "Supply",
        accessor: "supply",
      },
      {
        Header: "Volume (24Hr)",
        accessor: "volumeUsd24Hr",
      },
      {
        Header: "Change (24Hr)",
        Cell: ColorTdCell,
        accessor: "changePercent24Hr",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col w-screen h-screen px-24 py-16">
      <h1 className="self-center text-2xl font-bold">
        👾 If the list is empty, please refresh 👽
      </h1>
      <button
        className="my-2 py-1 w-28 items-center flex rounded-lg bg-gray-100 hover:bg-gray-200"
        onClick={handleOnClick}
      >
        <div className="ml-2 shadow">📺</div>
        <span className="w-5/6 text-center font-medium tracking-tighter">
          Watchlist
        </span>
      </button>

      <Table columns={columns} data={coins} />
    </div>
  );
}

export default App;
