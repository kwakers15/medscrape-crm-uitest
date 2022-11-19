import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MedscrapeClient from '../api/MedscrapeClient'
import KOLCard from './KOLCard';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import FirebaseApp from '../firebase'
import { DialogContent, Dialog, DialogTitle, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'

// TODO SET USER LISTS PROPERLY AND MAKE SURE THE TIMING FOR SETUSER IS DONE PROPERLY SO THAT USERS CAN ADD KOLS TO THEIR LISTS
const App = () => {
  const [kols, setKols] = useState([])
  const [user, setUser] = useState({})
  const [open, setOpen] = useState(false)
  const [currentKol, setCurrentKol] = useState({})
  const [userLists, setUserLists] = useState([])
  const [listToAddTo, setListToAddTo] = useState('')
  const [currentNotes, setCurrentNotes] = useState('')
  const auth = getAuth(FirebaseApp)

  useEffect(() => {
    const callApi = async () => {
      const client = new MedscrapeClient()
      setKols((await client.globalSearch({ query: 'pfizer', limit: 10, skip: 0 })).data.globalSearch.data)
    }
    callApi()
  }, [])

  useEffect(() => {
    if (Object.keys(user).length) {
      console.log('signed in user: ', user.email)
      refreshUserLists()
    }
  }, [user])


  const openModal = async (first, last, npi) => {
    setCurrentKol({ npi, first, last })
    setOpen(true)
  }

  const save = async () => {
    if (listToAddTo) {
      try {
        const token = await user.getIdToken()
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        await axios.post(`/list/${listToAddTo}/kol`, {
          npi: currentKol.npi,
          name: currentKol.first + " " + currentKol.last,
          notes: currentNotes
        }, config)
      }
      catch (e) {
        console.log(e)
      }
    }
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const createAccount = async (email, password) => {
    try {
      const createdUser = (await createUserWithEmailAndPassword(auth, email, password)).user
      const createUserBody = {
        email,
        uid: createdUser.uid
      }
      await axios.post(`/users`, createUserBody)
      console.log('created user successfully')
      console.log('signed in')
      setUser(auth.currentUser)
    }
    catch (e) {
      console.log(e)
    }
  }

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('signed in successfully')
      setUser(auth.currentUser)
    }
    catch (e) {
      console.log(e)
    }
  }

  const refreshUserLists = async () => {
    if (Object.keys(user).length) {
      try {
        const token = await user.getIdToken()
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const lists = await axios.get(`/lists`, config)
        setUserLists(lists.data)
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  const createTestList = async () => {
    try {
      const token = await user.getIdToken()
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await axios.post(`/list`, {
        name: "list1",
        kols: [
          {
            npi: '123456',
            name: 'kol1',
            notes: 'some notes about kol1'
          },
          {
            npi: '98786',
            name: 'kol5000',
            notes: 'some notes about kol5000'
          }
        ]
      }, config)
      console.log('list created successfully')
      refreshUserLists()
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <button onClick={() => createAccount('johnsmith@gmail.com', 'jsmith')}>Create Account {'(johnsmith@gmail.com)'}</button>
      <button onClick={() => signIn('bobsmith@gmail.com', 'password')}>Sign in {'(bobsmith@gmail.com)'}</button>
      <button onClick={createTestList}>Create Test List</button>
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