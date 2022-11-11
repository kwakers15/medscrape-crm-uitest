import React, { useEffect, useState } from 'react'
import MedscrapeClient from '../api/MedscrapeClient'
import KOLCard from './KOLCard';

const App = () => {
  const [kols, setKols] = useState([])

  useEffect(() => {
    const callApi = async () => {
      const client = new MedscrapeClient()
      setKols((await client.globalSearch({ query: 'pfizer', limit: 10, skip: 0 })).data.globalSearch.data)
    }
    callApi()
  }, [])

  const openModal = (first, last, npi) => {
    console.log(first, last, npi)
  }

  return (
    <div>
      {kols.map(({ npi_number, first_name, last_name }) => {
        return (
          <KOLCard key={npi_number} npi={npi_number} first_name={first_name} last_name={last_name} action={openModal} />
        )
      })}
    </div>
  )
}

export default App