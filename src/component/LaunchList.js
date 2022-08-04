import { useEffect,useState } from 'react';
import { useQuery, gql, } from '@apollo/client';

const GET_LAUNCHES = gql`
  query GetLaunches {
    launches {
            mission_name
            rocket {
            rocket_name
            rocket_type
            }
            launch_date_local
        }
    }
`;

const LaunchList=()=>{
    const [currentPage, setCurrentPage] = useState(0);
    const [PerPage] = useState(20);
    const [ content, setContent ]=useState([])
    const [ display, setDisplay ]=useState([])
    const [ searchInput, setSearchInput ]=useState('')
    const [ order, setOrder ]=useState('ASC')
    const { loading, error, data } = useQuery(GET_LAUNCHES);

    const sorting = (key) =>{
        if(key.includes('rocket')){
            const newkey = key.split('.')
            if(order==='ASC'){
                const sorted = [...content].sort((a,b)=>
                a[newkey[0]][newkey[1]].toLowerCase() >  b[newkey[0]][newkey[1]].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('DSC')
            }
            if(order==='DSC'){
                const sorted = [...content].sort((a,b)=>
                a[newkey[0]][newkey[1]].toLowerCase() <  b[newkey[0]][newkey[1]].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('ASC')
            }
        }else{
            if(order==='ASC'){
                const sorted = [...content].sort((a,b)=>
                a[key].toLowerCase() >  b[key].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('DSC')
            }
            if(order==='DSC'){
                const sorted = [...content].sort((a,b)=>
                a[key].toLowerCase() <  b[key].toLowerCase() ? 1:-1
                )
                setContent(sorted)
                setOrder('ASC')
            }
        }
     }
    
     const filterFun = () =>{
        const filterdata = data.launches.filter(item=>
            item.mission_name.toLowerCase().includes(searchInput.toLowerCase())||
            item.rocket.rocket_name.toLowerCase().includes(searchInput.toLowerCase())||
            item.rocket.rocket_type.toLowerCase().includes(searchInput.toLowerCase()))
            setContent(filterdata)  
     }

    useEffect(()=>{
        if(data){
            setContent(data.launches)
            filterFun()
        }
    },[data,searchInput])
    useEffect(() => {
        const ContentDisplay = content
        const startPerPage = currentPage *PerPage
        const endPerPage = PerPage+startPerPage
        setDisplay(ContentDisplay.slice(startPerPage,endPerPage))
      }, [content,currentPage])

    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error :(</p>;

    return(
        
        <div className='container'>
            <input type="text" placeholder='Search...' onChange={e=>setSearchInput(e.target.value)}/>
            <table>
                <thead>
                    <tr>
                        <th onClick={()=>sorting('mission_name')}>Mission Name</th>
                        <th onClick={()=>sorting('rocket.rocket_name')}>Rocket Name</th>
                        <th onClick={()=>sorting('rocket.rocket_type')}>Rocket Type</th>
                        <th onClick={()=>sorting('launch_date_local')}>Launch Date</th>
                    </tr>
                </thead>
                <tbody>
                    {display&&display.length>0&&display.map(({ mission_name, rocket, launch_date_local },i) =>{
                        const format_date = launch_date_local.substr(0, 10).replaceAll('-','/')
                        const {rocket_name,rocket_type}=rocket
                        return(
                            <tr key={i}>
                                <td>{mission_name}</td>
                                <td>{rocket_name}</td>
                                <td>{rocket_type}</td>
                                <td>{format_date}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='page'>
                <button disabled={!currentPage} onClick={()=>setCurrentPage(currentPage-1)}>上一頁</button>
                <p> Page {currentPage+1}</p>
                <button disabled={display.length<20} onClick={()=>setCurrentPage(currentPage+1)}>下一頁</button>
            </div>
        </div>
    )
}
export default LaunchList