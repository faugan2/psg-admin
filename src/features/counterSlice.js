import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState:{
    page:0,
    sports:[],
    leagues:[],
    user:null,
    users:[],
    selectedGame:null,
    selectedGames:[],
    challenges:[],
    allPicks:null,
	coins:[]
    
  },
 
  reducers: {
    

    setPage:(state,action)=>{
      state.page=action.payload;
    },
    setSports:(state,action)=>{
      state.sports=action.payload;
    },
    setUser:(state,action)=>{
      state.user=action.payload;
    },
    setUsers:(state,action)=>{
      state.users=action.payload;
    },
    setLeagues:(state,action)=>{
      state.leagues=action.payload;
    },
    setSelectedGame:(state,action)=>{
      state.selectedGame=action.payload;
    },
    setSelectedGames:(state,action)=>{
      state.selectedGames=action.payload;
    },
    setChallenges:(state,action)=>{
      state.challenges=action.payload;
    },
	setCoins:(state,action)=>{
		state.coins=action.payload;
	},
  setAllPicks:(state,action)=>{
    state.allPicks=action.payload;
  }
  },
 
});

export const { 
    setPage,
    setSports,
    setUser, 
    setUsers,
    setLeagues,
    setSelectedGame,
    setSelectedGames,
    setChallenges,
    setAllPicks,
	setCoins
  } = counterSlice.actions;


export const selectPage=(state)=>state.counter.page;
export const selectSports=(state)=>state.counter.sports;
export const selectUser=(state)=>state.counter.user;
export const selectUsers=(state)=>state.counter.users;
export const selectLeagues=(state)=>state.counter.leagues;
export const selectSelectedGame=(state)=>state.counter.selectedGame;
export const selectSelectedGames=(state)=>state.counter.selectedGames;
export const selectChallenges=(state)=>state.counter.challenges;
export const selectCoins=(state)=>state.counter.coins;
export const selectAllPicks=(state)=>state.counter.allPicks;

export default counterSlice.reducer;
