'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Paper } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false); 
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResult, setSearchResult] = useState(''); 

  const UpdateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await UpdateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await UpdateInventory();
  };

  const handleSearch = () => {
    const item = inventory.find(i => i.name.toLowerCase() === searchQuery.toLowerCase());
    if (item) {
      setSearchResult(`${item.name.charAt(0).toUpperCase() + item.name.slice(1)}: ${item.quantity} left`);
    } else {
      setSearchResult('Item not found');
    }

    // Hide search result after 3 seconds
    setTimeout(() => {
      setSearchResult('');
    }, 3000); 
  };

  useEffect(() => {
    UpdateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={4}
      bgcolor="#f5f5f5"
      p={4}
    >
      {/* Search Field */}
      <Box
        sx={{
          position: 'absolute',
          top: '20px', 
          right: '20px', 
          width: '400px'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              bgcolor: "#fff",
              borderRadius: '8px',
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ bgcolor: "#1976d2", color: "#fff", borderRadius: '8px' }}
          >
            Search
          </Button>
        </Stack>

        {/* Search Result (hidden after 3 seconds) */}
        {searchResult && (
          <Typography variant="h6" color="#333" mt={1}>
            {searchResult}
          </Typography>
        )}
      </Box>

      {/* Inventory Modal and Add Item Form */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h5" color="#333" textAlign="center" mb={2}>
            Add New Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <Button 
              variant="contained" 
              sx={{ bgcolor: "#1976d2", color: "#fff", borderRadius: '8px' }}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{ 
          bgcolor: "#1976d2", 
          color: "#fff", 
          borderRadius: '8px',
          fontWeight: 'bold',
          padding: '10px 20px',
        }}
      >
        Add New Item
      </Button>

      <Box 
        width="100%" 
        maxWidth="800px" 
        p={2}
        borderRadius="8px"
        bgcolor="#e3f2fd"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        textAlign="center"
      >
        <Typography variant="h4" color="#333">
          Inventory Items
        </Typography>
      </Box>

      <Stack 
        width="100%" 
        maxWidth="800px" 
        spacing={2} 
        sx={{ overflowY: "auto", padding: 2, maxHeight: "400px" }}
      >
        {
          filteredInventory.map(({ name, quantity }) => (
            <Paper 
              key={name}
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#fff',
              }}
            >
              <Typography variant='h5' color='#333'>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h5' color='#333'>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => addItem(name)}
                  sx={{ bgcolor: "#4caf50", color: "#fff", borderRadius: '8px' }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{ bgcolor: "#f44336", color: "#fff", borderRadius: '8px' }}
                >
                  Remove
                </Button>
              </Stack>
            </Paper>
          ))
        }
      </Stack>
    </Box>
  );
}
