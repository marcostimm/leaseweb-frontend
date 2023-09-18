import { Fragment, useState } from "react";
import "./App.css";
import { useQuery } from "react-query";

type Server = {
  id:       number;
  model:    string;
  ram:      string;
  hdd:      string;
  location: string;
  price:    string;
};

const hardDisks = [
  "SAS",
  "SSD",
  "SATA",
];

const ramList = [
  "2",
  "4",
  "8",
  "12",
  "16",
  "24",
  "32",
  "48",
  "64",
  "96",
];

function App() {
  const [harddisk, setHarddisk] = useState('');
  const [ram, setRam] = useState<string[]>([]);

  const { isLoading, data } = useQuery(['serverData', harddisk, ram], () =>
      fetch(`http://localhost:8080/server?hdd=${harddisk}&ram=${ram.join(',')}`).then(
        (res) => res.json(),
      ),
  )

  const handleHarddiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'All') {
      setHarddisk('');
      return;
    }
    setHarddisk(e.target.value);
  }

  const handleRam = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (ram.includes(value)) {
      setRam(ram.filter((r) => r !== value));
      return;
    }
    setRam([...ram, value]);
  }

  return (
    <Fragment>
      <div className="card">
        <a href="https://www.leaseweb.com/nl" target="_blank">
          <img
            src="https://developer.leaseweb.com/images/leaseweb_logo.png"
            className="logo"
            alt="Leaseweb"
          />
        </a>

        <div className="filters">
          <div className="filterHarddisk">
            <label htmlFor="harddisk">Harddisk type</label>
            <select name="harddisk" id="harddisk" onChange={handleHarddiskChange} value={harddisk}>
              <option value="">All</option>
              { hardDisks.map((hd) => (
                <option key={hd} value={hd}>{hd}</option>
              ))}
            </select>
          </div>
          <div className="filterRam">
            <label>RAM</label>
            { ramList.map((r) => 
                <span key={r}><input type="checkbox" name="ram" value={r} onChange={handleRam} />{r}GB</span>
            )}
          </div>
        </div>

        <div className="totalResults">
          <span>{data && data.data.length} results</span>
        </div>

        <div className="list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Model</th>
                <th>RAM</th>
                <th>HDD</th>
                <th>Location</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              { isLoading && <tr><td colSpan={6}>Loading...</td></tr> }
              { data && data.data.map((server: Server) => (
                <tr key={server.id}>
                  <td>{server.id}</td>
                  <td>{server.model}</td>
                  <td>{server.ram}</td>
                  <td>{server.hdd}</td>
                  <td>{server.location}</td>
                  <td>{server.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
