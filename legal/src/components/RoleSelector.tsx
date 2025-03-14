import { useNavigate } from "react-router"

export default function RoleSelector({ roles }: { roles: RoleType[] }) {
  const navigate = useNavigate()

  const handleRoleSelect = (roleName: string) => {
    switch (roleName) {
      case "legal":
        navigate("/legal")
        break
      default:
        navigate("/unauthorized")
    }
  }

  return (
    <div className="role-selector">
      <h2>Seleccione un rol</h2>
      <div className="role-buttons">
        {roles.map(role => (
          <button key={role.id} onClick={() => handleRoleSelect(role.name)}>
            {role.name}
          </button>
        ))}
      </div>
    </div>
  )
}
