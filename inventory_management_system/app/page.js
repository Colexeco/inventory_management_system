'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import {firestore} from '@/firebase'
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'
import {Box, Typography, Modal, Stack, TextField, Button} from '@mui/material'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState(false)
  const [displaySearchResult, setDisplaySearchResult] = useState(false)
  const [searchResultList, setSearchResultList] = useState([])
  const [searchItemName, setSearchItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const searchItem = async (item) => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const searchResultList = []
    docs.forEach((doc) => {
      if (doc.id == item) {
        searchResultList.push({
          name: doc.id,
          ...doc.data(),
        })
        setSearchResultList(searchResultList)
        console.log(searchResultList)
      }
    })
    await searchItem()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      await deleteDoc(docRef)
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    searchItem()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const searchOpen = () => setSearch(true)
  const searchClose = () => setSearch(false)
  const handleSearchResultOpen = () => setDisplaySearchResult(true)
  const handleSearchResultClose = () => {setDisplaySearchResult(false), setSearchResultList([])}

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection={"column"}
      justifyContent="center" 
      alignItems={"center"} 
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position={'absolute'}
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform:"translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}
            ></TextField>
            <Button variant="outlined" onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      {/*DISPLAY SEARCH RESULTS*/}
      <Modal
        open={displaySearchResult}
        onClose={handleSearchResultClose}
      >
        <Box
          position={'absolute'}
          top="50%"
          left="50%"
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform:"translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6" textAlign={"center"}>Search Results</Typography>
          <Stack 
          width="800px" 
          height="300px" 
          spacing={2} 
          >
          {searchResultList.map(({name, quantity})=>(
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                alignItems={"center"} 
                justifyContent={"space-between"} 
                bgcolor={"#f0f0f0"} 
                padding={5}
              >
              <Typography 
                  variance='h3' 
                  color="#333" 
                  textAlign={"center"}
                >{name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography 
                  variance='h3' 
                  color="#333" 
                  textAlign={"center"}
                >{quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => {
                  addItem(name)
                }}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => {
                  removeItem(name)
                }}>
                  Decrement
                </Button>
                <Button variant="contained" onClick={() => {
                  deleteItem(name)
                }}>
                  Delete
                </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={search}
        onClose={searchClose}
      >
        <Box
          position={'absolute'}
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform:"translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Search Item By Name</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant="outlined"
            fullWidth
            value={searchItemName}
            onChange={(e) => {
              setSearchItemName(e.target.value)
            }}
            ></TextField>
            <Button variant="outlined" onClick={()=>{
              searchItem(searchItemName)
              setSearchItemName('')
              handleSearchResultOpen()
              console.log(displaySearchResult)
              searchClose()
              }}
            >
              Search</Button>
          </Stack>
        </Box>
      </Modal>
        <Button variant="contained" onClick={() => {
          handleOpen()
        }}>
          Add New Item
        </Button>
        <Button variant="contained" onClick={() => {
          searchOpen()
        }}>
          Search Item By Name
        </Button>
        <Box border='1px solid #333'>
          <Box width="800px" height="100px"
          bgcolor="#ADD8E6"
          alignItems={"center"}
          justifyContent={"center"}
          display="flex"
          >
            <Typography
            variant="h2"
            color="#333"
            >Inventory Items</Typography>
          </Box>
          {/*DISPLAY FULL INVENTORY*/}
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {inventory.map(({name, quantity})=>(
                <Box 
                  key={name} 
                  width="100%" 
                  minHeight="150px" 
                  display="flex" 
                  alignItems={"center"} 
                  justifyContent={"space-between"} 
                  bgcolor={"#f0f0f0"} 
                  padding={5}
                >
                <Typography 
                    variance='h3' 
                    color="#333" 
                    textAlign={"center"}
                  >{name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography 
                    variance='h3' 
                    color="#333" 
                    textAlign={"center"}
                  >{quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => {
                    addItem(name)
                  }}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name)
                  }}>
                    Decrement
                  </Button>
                  <Button variant="contained" onClick={() => {
                    deleteItem(name)
                  }}>
                    Delete
                  </Button>
                  </Stack>
                </Box>
              ))}
          </Stack>
        </Box>
    </Box>
  )
}
