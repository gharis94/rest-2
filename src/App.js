import './App.css';
import { useEffect,useState,useCallback } from 'react';
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://currency-converter5.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_KEY,
    'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
  }
  
})

function App() {
  const [currencies,setCurrencies]= useState({});
  const [selected,setSelected] = useState({
    from:'',
    to:''
  })
  const [amount,setAmount]=useState(0);
  const [result,setResult] = useState({});

  const fetchData=async(url,param=null)=>{
    try{
      let rsp;
      
      if (url === 'currency/list') {
        console.log('yes')
         rsp = await client({
          method: 'GET',
          url: url,
        });
         setCurrencies(rsp.data.currencies)
      }else{
        rsp =await client({
          method:'GET',
          url:url,
          params:param
        })
        
        console.log(rsp.data)
        setResult(rsp.data)
      }
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchData('currency/list')
   // console.log('hello')
  },[])

  const request=()=>{
    
    let param={
      format: 'json', 
      to: selected.to,
      from: selected.from, 
      amount: amount
    }
    //currency/convert?format=json&to=PKR&from=EUR&amount=2
    console.log(param)
    fetchData('currency/convert', param)
  }

  const handleChange=(e)=>{
    const {name,value} = e.target
    console.log(name,value)
    setSelected({...selected,[name]:value})
  }
  console.log(currencies)
  console.log(selected)
  return (
    <div className="flex justify-center items-center bg-slate-200 h-screen ">
      <div className='flex flex-col items-center w-1/2 h-10/12 bg-white drop-shadow-lg p-6'>
        <p className='font-semibold text-lg'>Currency Converter</p>
      <div className='flex justify-evenly space-x-6 my-3'>
        <label>
            From:
            <select name = 'from'
            value={selected.from}
            onChange = {
              (e) => handleChange(e)
            }>
              {
                currencies && Object.keys(currencies).map(currency=>(
                  <option key={currency} value={currency}>{currencies[currency]}</option>
                ))
              }
              
          
        </select>
            <div className = 'flex bg-slate-400 w-[70px]  text-gray-200 px-2 rounded-md mt-2' >
              <input className=' bg-transparent outline-none flex-grow ' value={amount} onChange={(e)=>setAmount(e.target.value)}/>
              <p>{selected.from}</p>    
            </div>
          

        </label>
        <label>
            To:
            <select name='to' value={selected.to} onChange={(e)=>handleChange(e)} >
              {
                currencies && Object.keys(currencies).map(currency=>(
                  <option key={currency} value={currency}>{currencies[currency]}</option>
                ))
              }
        </select>
              <div className = 'flex bg-slate-400 w-[70px]  text-gray-200 px-2 rounded-md mt-2 h-[24px]' >
              <p>{result?.amount?.toFixed(2)}</p>
              <p>{selected.to}</p>    
            </div>
        </label>
      </div>
          <button className='bg-slate-400 px-10 py-1 rounded-lg text-gray-200 hover:bg-slate-500 transition' onClick={()=>request()}>Calculate</button>
      </div>
    </div>
  );
}

export default App;
