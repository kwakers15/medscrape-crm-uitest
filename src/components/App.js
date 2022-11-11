import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MedscrapeClient from '../api/MedscrapeClient'
import KOLCard from './KOLCard';
import { DialogContent, Dialog, DialogTitle, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'

const App = () => {
  const [kols, setKols] = useState([])
  const [userId, setUserId] = useState('')
  const [open, setOpen] = useState(false)
  const [currentKol, setCurrentKol] = useState({})
  const [userLists, setUserLists] = useState([])
  const [listToAddTo, setListToAddTo] = useState('')
  const [currentNotes, setCurrentNotes] = useState('')

  useEffect(() => {
    const callApi = async () => {
      const client = new MedscrapeClient()
      setKols((await client.globalSearch({ query: 'pfizer', limit: 10, skip: 0 })).data.globalSearch.data)

      // will eventually call some api to get the current user
      setUserId('user1')
    }
    callApi()
  }, [])

  useEffect(() => {
    const callApi = async () => {
      if (userId) {
        const lists = await axios.get(`/${userId}/lists`)
        setUserLists(lists.data)
      }
    }
    callApi()
  }, [userId])

  const openModal = async (first, last, npi) => {
    setCurrentKol({ npi, first, last })
    setOpen(true)
  }

  const save = async () => {
    if (listToAddTo) {
      await axios.post(`/${userId}/list/${listToAddTo}/kol`, {
        npi: currentKol.npi,
        name: currentKol.first + " " + currentKol.last,
        notes: currentNotes
      })
    }
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {kols.map(({ npi_number, first_name, last_name }) => {
        return (
          <KOLCard key={npi_number} npi={npi_number} first_name={first_name} last_name={last_name} action={openModal} />
        )
      })}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add KOL to List - {currentKol.first + " " + currentKol.last}
        </DialogTitle>
        <DialogContent dividers>
          <FormControl sx={{ mb: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">List</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={listToAddTo}
              label="Age"
              onChange={e => setListToAddTo(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {userLists.map(list => {
                return (
                  <MenuItem key={list._id} value={list._id}>{list.name}</MenuItem>
                )
              })}
            </Select>
            <FormHelperText>Select List to Add to</FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="Notes (Optional)"
            multiline
            rows={4}
            defaultValue=""
            onChange={e => setCurrentNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={save}>
            Save changes
          </Button>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App