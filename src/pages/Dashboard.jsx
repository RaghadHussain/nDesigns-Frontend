import { useAuth } from "../context/AuthContext"
import useDocumentTitle from "../hooks/useDocumentTitle"

function Dashboard({  }) {
  useDocumentTitle("Dashboard")
  const {user} = useAuth()
  return (
    <div>
        <h1>Welcome {user.username}</h1>
    </div>
  )
}

export default Dashboard