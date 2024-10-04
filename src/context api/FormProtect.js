import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


const ProtectedForms = ({element , ...rest})=>{
    const [creadit , setCreadit] = useState(0)
useEffect(()=>{
    const id = localStorage.getItem('userid');
    if (!id) return;
    try {
        const response = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const fetchedCredits = data.quantity || 0; // Set available credits from server
          setCredits(fetchedCredits);
        }
      } catch (error) {
        console.error('Error fetching quantity:', error);
      }

})


}